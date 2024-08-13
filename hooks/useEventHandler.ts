import { useCallback, useInsertionEffect, useRef } from "react";

export function useEventHandler<Args extends any[], Result>(
  callback: (...args: Args) => Result,
): typeof callback & Function {
  const latestRef = useRef<typeof callback>(shouldNotBeInvokedBeforeMount as any);
  const lockRef = useRef(false);
  useInsertionEffect(() => {
    latestRef.current = callback;
  }, [callback]);
  return useCallback<typeof callback>((...args) => {
    if (lockRef.current) return null as never;
    const fn = latestRef.current;
    const ret = fn(...args);
    if (ret instanceof Promise) {
      lockRef.current = true;
      ret.finally(() => (lockRef.current = false));
      return ret;
    }
    return ret;
  }, []);
}

function shouldNotBeInvokedBeforeMount() {
  throw new Error("foxact: the stablized handler cannot be invoked before the component has mounted.");
}
