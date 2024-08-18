import { tw } from "bun-tailwindcss" with { type: "macro" };
import classNames from "classnames";
import type { ComponentProps } from "react";

export function PrimaryButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={classNames(
        tw(
          "bg-button text-button-text w-full rounded-2xl py-2 px-4 text-center shadow-md transition-all",
          "outline-offset-0 outline-transparent outline-solid",
          "focus-visible:outline-button focus-visible:outline-2 focus-visible:outline-offset-2",
        ),
        className,
      )}
    />
  );
}
