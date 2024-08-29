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
} & R): ReactNode;
export function ItemTypeMatcher<T extends { type: string }, R extends {}>({
  item,
  children,
}: {
  item: T;
  children?: ReactNode;
  type: {
    [K in T["type"]]: ComponentType<{ item: T & { type: K } } & R>;
  };
} & R): ReactNode;
export function ItemTypeMatcher<T extends { type: string }, R extends {}>({
  item,
  children,
  type,
  ...options
}: {
  item: T;
  children?: ReactNode;
} & R &
  ({
    [K in T["type"] as `type:${K}`]: ComponentType<{ item: T & { type: K } } & R>;
  } & {
    type: {
      [K in T["type"]]: ComponentType<{ item: T & { type: K } } & R>;
    };
  })) {
  if (type) {
    const Component = type[item.type as T["type"]];
    if (Component)
      // @ts-ignore
      return <Component item={item} {...options} />;
  } else {
    const { matcher = [], rest = [] } = Object.groupBy(Object.entries(options), ([key]) =>
      key.startsWith("type:") ? "matcher" : "rest",
    );
    for (const [key, Component] of matcher) {
      const type = key.slice(5);
      if (item.type === type) {
        const restObject = Object.fromEntries(rest);
        // @ts-ignore
        return <Component item={item} {...restObject} />;
      }
    }
  }
  return children;
}
