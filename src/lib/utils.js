export function deepCopy(obj) {
  // TODO: better solution
  return JSON.parse(JSON.stringify(obj))
}
