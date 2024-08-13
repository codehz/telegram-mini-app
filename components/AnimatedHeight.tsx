import { tw } from "bun-tailwindcss" with { type: "macro" };
import { useLayoutEffect, useRef, useState, type ComponentProps } from "react";

export function AnimatedHeight({
  children,
  ref: parentRef,
  ...props
}: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={tw(
        "relative box-content overflow-hidden transition-[height] contain-strict",
      )}
      style={{ height }}
      ref={parentRef}
    >
      <div {...props} ref={ref}>
        {children}
      </div>
    </div>
  );
}
