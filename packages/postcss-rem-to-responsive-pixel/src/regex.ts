// excluding regex trick: http://www.rexegg.com/regex-best-trick.html

export const remRegex
  = /"[^"]+"|'[^']+'|url\([^)]+\)|var\([^)]+\)|(\d+(?:\.\d+)?|\.\d+)rem/g

export const pxRegex
  = /"[^"]+"|'[^']+'|url\([^)]+\)|var\([^)]+\)|(\d+(?:\.\d+)?|\.\d+)px/g
