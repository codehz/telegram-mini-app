import { useMemo, type ComponentType, type ReactNode } from "react";

export function ItemTypeMatcher<T extends { type: string }, R extends {}>({
  item,
  children,
  ...options
}: {
  item: T;
  children?: ReactNode;
} & {
  [K in T["type"] as `type:${K}`]: ComponentType<{ item: T & { type: K } } & R>;
} & R) {
  const { matcher = [], rest = [] } = Object.groupBy(
    Object.entries(options),
    ([key]) => (key.startsWith("type:") ? "matcher" : "rest"),
  );
  for (const [key, Component] of matcher) {
    const type = key.slice(5);
    if (item.type === type) {
      const restObject = Object.fromEntries(rest);
      // @ts-ignore
      return <Component item={item} {...restObject} />;
    }
  }
  return children;
}
