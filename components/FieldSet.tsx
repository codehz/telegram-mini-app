import { tw } from "bun-tailwindcss" with { type: "macro" };
import type { ComponentProps, ReactNode } from "react";
import { AnimatedHeight } from "./AnimatedHeight";

export function FieldSet({
  title,
  children,
  footer,
  dynamic,
  initialHeight,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  dynamic?: boolean;
  initialHeight?: number | undefined;
}) {
  return (
    <div className={tw("pointer-events-children")}>
      {!!title && (
        <legend className={tw("text-hint pointer-events-none mx-4 mb-1 text-xs font-extralight")}>{title}</legend>
      )}
      {dynamic ? (
        <div className={tw("bg-secondary-bg auto-visibility rounded-2xl shadow-md contain-paint")}>
          <AnimatedHeight
            className={tw("grid", "divide-divide divide-y", "*:first:rounded-t-2xl *:last:rounded-b-2xl")}
            initialHeight={initialHeight}
          >
            {children}
          </AnimatedHeight>
        </div>
      ) : (
        <div
          className={tw(
            "bg-secondary-bg auto-visibility grid rounded-2xl shadow-md contain-paint",
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

export namespace FieldSet {
  export function Button(props: ComponentProps<"button">) {
    return (
      <button
        {...props}
        className={tw(
          "focus-visible:bg-button focus-visible:text-button-text text-accent-text flex w-full cursor-pointer appearance-none items-center justify-center gap-2 py-3 px-4 !outline-none transition-colors",
        )}
      />
    );
  }
  export function DangerButton(props: ComponentProps<"button">) {
    return (
      <button
        {...props}
        className={tw(
          "text-destructive-text focus-visible:bg-destructive-text focus-visible:text-bg flex w-full cursor-pointer appearance-none items-center justify-center gap-2 py-3 px-4 !outline-none transition-colors",
        )}
      />
    );
  }
}
