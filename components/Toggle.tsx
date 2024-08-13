import { makeClass, tw } from "bun-tailwindcss" with { type: "macro" };
import { memo, type ComponentPropsWithoutRef } from "react";

export const Toggle = memo(function Toggle({
  label,
  ...rest
}: {
  label?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "className" | "type">) {
  const core = (
    <div className={tw("relative my-2 cursor-pointer")}>
      <input className={tw("peer sr-only")} type="checkbox" {...rest} />
      <div
        className={makeClass(
          "toggle",
          "bg-bg after:bg-hint h-7 w-12 rounded-full inset-shadow-sm transition-all",
          "outline-0 outline-offset-0 outline-transparent outline-solid",
          "after:absolute after:inset-y-1 after:left-1 after:size-5 after:translate-x-0 after:rounded-full after:shadow after:transition-all",
          "peer-checked:bg-[var(--active-color,var(--color-accent-text))]",
          "peer-checked:after:bg-button-text peer-checked:after:translate-x-5",
          "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--active-color,var(--color-accent-text))]",
          "peer-disabled:opacity-40",
        )}
      />
    </div>
  );

  return label == null ? (
    <label>{core}</label>
  ) : (
    <label className={tw("flex h-11 items-center gap-2 px-4")}>
      <span className={tw("flex-1 text-sm")}>{label}</span>
      {core}
    </label>
  );
});
