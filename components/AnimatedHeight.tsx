import { tw } from "bun-tailwindcss" with { type: "macro" };
import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";

export function AnimatedHeight({
  children,
  ref: parentRef,
  initialHeight = 0,
  ...props
}: ComponentProps<"div"> & { initialHeight?: number | undefined }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(initialHeight);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={tw("relative box-content overflow-hidden transition-[height] contain-strict")}
      style={{ height }}
      ref={parentRef}
    >
      <div {...props} ref={ref}>
        {children}
      </div>
    </div>
  );
}
