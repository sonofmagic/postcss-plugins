import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { execa } from 'execa'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(scriptDir, '..', '..')
const packagesDir = path.join(rootDir, 'packages')

const rootPackage = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'),
)

const pnpmVersion = rootPackage.packageManager?.split('@')[1] ?? 'unknown'
const vitestVersion = rootPackage.devDependencies?.vitest ?? 'unknown'
const nodeVersion = process.version

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
  lines.push(`- Command: \`${command}\``)
  lines.push(`- Node: \`${nodeVersion}\``)
  lines.push(`- pnpm: \`${pnpmVersion}\``)
  lines.push(`- Vitest: \`${vitestVersion}\``)
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

function listPackageDirs() {
  if (!fs.existsSync(packagesDir)) {
    return []
  }
  return fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(packagesDir, entry.name))
}

async function runBenchmarks() {
  const packageDirs = listPackageDirs()

  for (const packageDir of packageDirs) {
    const packageJsonPath = path.join(packageDir, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      continue
    }

    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

    const pkgName = pkg.name ?? path.basename(packageDir)
    const version = pkg.version ?? '0.0.0'
    const outputDir = path.join(packageDir, 'benchmarks')
    const outputJsonName = `${version}.json`
    const outputJsonPath = path.join(outputDir, outputJsonName)
    const outputMarkdownPath = path.join(outputDir, `${version}.md`)

    fs.mkdirSync(outputDir, { recursive: true })

    const command = `pnpm -C ${path.relative(rootDir, packageDir)} exec vitest bench --outputJson benchmarks/${outputJsonName}`

    await execa('pnpm', [
      '-C',
      packageDir,
      'exec',
      'vitest',
      'bench',
      '--outputJson',
      `benchmarks/${outputJsonName}`,
    ], { stdio: 'inherit' })

    const report = JSON.parse(
      fs.readFileSync(outputJsonPath, 'utf8'),
    )

    const markdown = buildReportMarkdown(pkgName, version, command, report)
    fs.writeFileSync(outputMarkdownPath, markdown)

    fs.unlinkSync(outputJsonPath)
  }
}

await runBenchmarks()
