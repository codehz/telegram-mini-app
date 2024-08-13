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
  const Body = dynamic ? AnimatedHeight : "div";
  return (
    <div>
      {!!title && <legend className={tw("text-hint mx-4 mb-1 text-xs font-extralight")}>{title}</legend>}
      <Body
        className={tw(
          "bg-secondary-bg grid rounded-2xl shadow contain-style",
          "divide-divide divide-y",
          "*:first:rounded-t-2xl *:last:rounded-b-2xl",
        )}
      >
        {children}
      </Body>
      {footer}
    </div>
  );
}
