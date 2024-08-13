import {
  useCallback,
  useMemo,
  useRef,
  type MutableRefObject,
  type Ref,
  type RefCallback,
} from "react";

export function useForkRef<T>(...refs: (Ref<T> | undefined)[]) {
  return useCallback<RefCallback<T>>((node: T) => {
    for (const ref of refs) {
      if (!ref) continue
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as MutableRefObject<T | null>).current = node;
    }
  }, refs);
}

export function useForkedRef<T>(forwarded: Ref<T> | undefined) {
  const local = useRef<T>();
  return [local, useForkRef(forwarded, local)] as const;
}

export function useLocalRef<T>(forwarded: Ref<T>) {
  const local = useRef<T>();
  return useMemo(
    () =>
      ({
        get current() {
          return local.current ?? null;
        },
        set current(value: T | null) {
          if (typeof forwarded === "function") forwarded(value);
          else if (forwarded)
            (forwarded as MutableRefObject<T | null>).current = value;
          local.current = value ?? undefined;
        },
      }) as MutableRefObject<T>,
    [forwarded],
  );
}

class LocalRef<T> {}
