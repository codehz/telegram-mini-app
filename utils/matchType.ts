export function matchType<T extends { type: string }>(object: T) {
  return <R>(matcher: {
    [K in T["type"]]: (object: T & { type: K }) => R;
  }) => {
    // @ts-ignore
    return matcher[object.type](object);
  };
}
