import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..', '..')
const packagesDir = path.join(rootDir, 'packages')
const rootBenchmarksDir = path.join(rootDir, 'benchmarks')

const rootPackage = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'),
)

const pnpmVersion = rootPackage.packageManager?.split('@')[1] ?? 'unknown'
const vitestVersion = rootPackage.devDependencies?.vitest ?? 'unknown'
const nodeVersion = process.version

const rawArgs = process.argv.slice(2)
const cliOptions = new Map()
const filters = []

for (const arg of rawArgs) {
  if (arg === '--') {
    continue
  }

  if (arg.startsWith('--label=')) {
    cliOptions.set('label', arg.slice('--label='.length))
    continue
  }

  filters.push(arg)
}

const label = cliOptions.get('label') ?? process.env.BENCHMARK_LABEL ?? new Date().toISOString().slice(0, 10)
const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', ' UTC')

const tableHeaders = [
  'name',
  'hz',
  'min',
  'max',
  'mean',
  'p75',
  'p99',
  'p995',
  'p999',
  'rme',
  'samples',
]

function formatNumber(value) {
  const number = typeof value === 'number' ? value : 0
  const fixed = number < 100 ? number.toFixed(4) : number.toFixed(2)
  const parts = fixed.split('.')
  const withCommas = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts[1] ? `${withCommas}.${parts[1]}` : withCommas
}

function formatRme(value) {
  const number = typeof value === 'number' ? value : 0
  return `+/-${number.toFixed(2)}%`
}

function formatRow(bench) {
  return [
    bench.name,
    formatNumber(bench.hz),
    formatNumber(bench.min),
    formatNumber(bench.max),
    formatNumber(bench.mean),
    formatNumber(bench.p75),
    formatNumber(bench.p99),
    formatNumber(bench.p995),
    formatNumber(bench.p999),
    formatRme(bench.rme),
    (bench.sampleCount ?? 0).toString(),
  ]
}

function renderTable(benchmarks) {
  const lines = []
  lines.push(`| ${tableHeaders.join(' | ')} |`)
  lines.push(`| ${tableHeaders.map(() => '---').join(' | ')} |`)
  for (const bench of benchmarks) {
    const row = formatRow(bench)
    lines.push(`| ${row.join(' | ')} |`)
  }
  return lines.join('\n')
}

function buildReportMarkdown(pkgName, version, command, report) {
  const lines = []
  lines.push('# Benchmark Results')
  lines.push('')
  lines.push(`## ${pkgName} ${version} - ${timestamp}`)
  lines.push('')
  lines.push(`- Label: \`${label}\``)
  lines.push(`- Command: \`${command}\``)
  lines.push(`- Node: \`${nodeVersion}\``)
  lines.push(`- pnpm: \`${pnpmVersion}\``)
  lines.push(`- Vitest: \`${vitestVersion}\``)
  lines.push(`- CPU: \`${os.cpus()?.[0]?.model ?? 'unknown'}\``)
  lines.push('')

  const groups = report.files.flatMap(file => file.groups)
  if (!groups.length) {
    lines.push('No benchmark results were produced.')
    lines.push('')
    return lines.join('\n')
  }

  for (const group of groups) {
    lines.push(`### ${group.fullName}`)
    lines.push('')
    lines.push('Times are in milliseconds. `hz` is operations per second.')
    lines.push('')
    lines.push(renderTable(group.benchmarks))
    lines.push('')
  }

  return lines.join('\n')
}

function buildSummaryMarkdown(items) {
  const lines = []
  lines.push('# Benchmark Baseline Summary')
  lines.push('')
  lines.push(`- Label: \`${label}\``)
  lines.push(`- Generated at: \`${timestamp}\``)
  lines.push(`- Node: \`${nodeVersion}\``)
  lines.push(`- pnpm: \`${pnpmVersion}\``)
  lines.push(`- Vitest: \`${vitestVersion}\``)
  lines.push(`- CPU: \`${os.cpus()?.[0]?.model ?? 'unknown'}\``)
  lines.push('')

  if (!items.length) {
    lines.push('No benchmark files were generated.')
    lines.push('')
    return lines.join('\n')
  }

  lines.push('| package | version | benches | report | raw |')
  lines.push('| --- | --- | --- | --- | --- |')

  for (const item of items) {
    lines.push(`| ${item.name} | ${item.version} | ${item.count} | [md](${item.markdownRel}) | [json](${item.jsonRel}) |`)
  }

  lines.push('')
  return lines.join('\n')
}

function normalizePackageFilter(entries) {
  const normalized = entries
    .map(entry => entry.trim())
    .filter(Boolean)
  return new Set(normalized)
}

function hasBenchFiles(packageDir) {
  const testDir = path.join(packageDir, 'test')
  if (!fs.existsSync(testDir)) {
    return false
  }

  const stack = [testDir]
  while (stack.length > 0) {
    const current = stack.pop()
    if (!current) {
      continue
    }

    const entries = fs.readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name)
      if (entry.isDirectory()) {
        stack.push(fullPath)
        continue
      }
      if (/\.bench\.(?:ts|mts|js|mjs)$/.test(entry.name)) {
        return true
      }
    }
  }

  return false
}

function listPackageDirs(filterSet) {
  if (!fs.existsSync(packagesDir)) {
    return []
  }

  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(packagesDir, entry.name))
    .filter((dir) => {
      if (!hasBenchFiles(dir)) {
        return false
      }

      if (!filterSet.size) {
        return true
      }

      const baseName = path.basename(dir)
      if (filterSet.has(baseName)) {
        return true
      }

      const packageJsonPath = path.join(dir, 'package.json')
      if (!fs.existsSync(packageJsonPath)) {
        return false
      }

      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
      return Boolean(pkg.name && filterSet.has(pkg.name))
    })
}

async function runBenchmarks() {
  const filterSet = normalizePackageFilter(filters)
  const packageDirs = listPackageDirs(filterSet)
  const summaryDir = path.join(rootBenchmarksDir, label)

  fs.mkdirSync(summaryDir, { recursive: true })

  const summaryItems = []

  for (const packageDir of packageDirs) {
    const packageJsonPath = path.join(packageDir, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
    const pkgName = pkg.name ?? path.basename(packageDir)
    const version = pkg.version ?? '0.0.0'
    const outputDir = path.join(packageDir, 'benchmarks')
    const outputJsonPath = path.join(outputDir, `${label}.json`)
    const outputMarkdownPath = path.join(outputDir, `${label}.md`)

    fs.mkdirSync(outputDir, { recursive: true })

    const command = `pnpm -C ${path.relative(rootDir, packageDir)} exec vitest bench --outputJson benchmarks/${label}.json`

    execFileSync('pnpm', [
      '-C',
      packageDir,
      'exec',
      'vitest',
      'bench',
      '--outputJson',
      `benchmarks/${label}.json`,
    ], { stdio: 'inherit' })

    const report = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'))
    const markdown = buildReportMarkdown(pkgName, version, command, report)

    fs.writeFileSync(outputMarkdownPath, markdown)

    const groups = report.files.flatMap(file => file.groups)
    const benchmarkCount = groups.reduce((total, group) => total + group.benchmarks.length, 0)

    summaryItems.push({
      count: benchmarkCount,
      jsonRel: path.relative(summaryDir, outputJsonPath).replaceAll(path.sep, '/'),
      markdownRel: path.relative(summaryDir, outputMarkdownPath).replaceAll(path.sep, '/'),
      name: pkgName,
      version,
    })
  }

  const summaryMarkdownPath = path.join(summaryDir, 'SUMMARY.md')
  const manifestPath = path.join(summaryDir, 'manifest.json')

  fs.writeFileSync(summaryMarkdownPath, buildSummaryMarkdown(summaryItems))
  fs.writeFileSync(manifestPath, JSON.stringify({
    generatedAt: timestamp,
    label,
    nodeVersion,
    packages: summaryItems,
    pnpmVersion,
    vitestVersion,
  }, null, 2))
}

await runBenchmarks()
