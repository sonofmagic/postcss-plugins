export const filterPropList = {
  exact(list: readonly string[]) {
    return list.filter(m => /^[^*!]+$/.test(m))
  },
  contain(list: readonly string[]) {
    return list
      .filter(m => /^\*.+\*$/.test(m))
      .map(m => m.substring(1, m.length - 1))
  },
  endWith(list: readonly string[]) {
    return list
      .filter(m => /^\*[^*]+$/.test(m))
      .map(m => m.substring(1))
  },
  startWith(list: readonly string[]) {
    return list
      .filter(m => /^[^*!]+\*$/.test(m))
      .map(m => m.substring(0, m.length - 1))
  },
  notExact(list: readonly string[]) {
    return list
      .filter(m => /^![^*].*$/.test(m))
      .map(m => m.substring(1))
  },
  notContain(list: readonly string[]) {
    return list
      .filter(m => /^!\*.+\*$/.test(m))
      .map(m => m.substring(2, m.length - 1))
  },
  notEndWith(list: readonly string[]) {
    return list
      .filter(m => /^!\*[^*]+$/.test(m))
      .map(m => m.substring(2))
  },
  notStartWith(list: readonly string[]) {
    return list
      .filter(m => /^![^*]+\*$/.test(m))
      .map(m => m.substring(1, m.length - 1))
  },
}
