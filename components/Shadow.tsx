import { useLayoutEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementRef } from "react";

export function Shadow({
  ["shadow:className"]: shadowClassName,
  ["shadow:height"]: shadowHeight = false,
  ["shadow:width"]: shadowWidth = false,
  ...props
}: {
  ["shadow:className"]?: string;
  ["shadow:height"]?: boolean;
  ["shadow:width"]?: boolean;
} & ComponentPropsWithoutRef<"div">) {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const ref = useRef<ElementRef<"div">>(null);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setSize(entry.contentRect));
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div
        style={{
          width: shadowWidth ? size.width : undefined,
          height: shadowHeight ? size.height : undefined,
        }}
        className={shadowClassName}
      />
      <div {...props} ref={ref} />
    </>
  );
}
