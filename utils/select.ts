export function select<K extends string>(value: K) {
  return <const T extends (Partial<Record<K, any>> & { "": any }) | Record<K, any>>(obj: T): T[keyof T] =>
    value in obj ? obj[value] : (obj as any)[""];
}
