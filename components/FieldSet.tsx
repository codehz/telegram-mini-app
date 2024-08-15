import { tw } from "bun-tailwindcss" with { type: "macro" };
import type { ReactNode } from "react";
import { AnimatedHeight } from "./AnimatedHeight";

export function FieldSet({
  title,
  children,
  footer,
  dynamic,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  dynamic?: boolean;
}) {
  return (
    <div>
      {!!title && <legend className={tw("text-hint mx-4 mb-1 text-xs font-extralight")}>{title}</legend>}
      {dynamic ? (
        <div className={tw("bg-secondary-bg rounded-2xl shadow-md contain-paint")}>
          <AnimatedHeight
            className={tw("grid", "divide-divide divide-y", "*:first:rounded-t-2xl *:last:rounded-b-2xl")}
          >
            {children}
          </AnimatedHeight>
        </div>
      ) : (
        <div
          className={tw(
            "bg-secondary-bg grid rounded-2xl shadow-md contain-paint",
            "divide-divide divide-y",
            "*:first:rounded-t-2xl *:last:rounded-b-2xl",
          )}
        >
          {children}
        </div>
      )}
      {footer}
    </div>
  );
}
