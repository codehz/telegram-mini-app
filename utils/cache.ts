export function cache<T>(serialize: (value: T) => string): (value: T) => T {
  let key = "";
  let lastValue: T | null = null;
  return (value) => {
    if (key !== serialize(value)) {
      key = serialize(value);
      lastValue = value;
    }
    return lastValue!;
  };
}
