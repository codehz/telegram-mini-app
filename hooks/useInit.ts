import { useRef } from "react";

const Marker = Symbol();

export function useInit<Fn extends (...args: any) => any>(fn: Fn, ...params: Parameters<Fn>): ReturnType<Fn> {
  const ref = useRef<typeof Marker | ReturnType<Fn>>(Marker);
  if (ref.current === Marker) ref.current = fn(...params);
  return ref.current as ReturnType<Fn>;
}
