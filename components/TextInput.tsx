import { makeClass, tw } from "bun-tailwindcss" with { type: "macro" };
import type { ComponentPropsWithoutRef } from "react";

export function TextInput({
  label,
  placeholder = `请输入${label}`,
  ...rest
}: { label: string } & ComponentPropsWithoutRef<"input">) {
  return (
    <label className={tw("flex items-center")}>
      <span className={tw("py-2 pl-4 text-sm")}>{label}</span>
      <input
        className={makeClass(
          "text-input",
          "relative z-10 mx-2 my-2 flex-1 rounded-full border-none py-1 pr-2 pl-8 text-right text-sm transition-all",
          "placeholder:text-hint placeholder:font-extralight",
          "outline-0 outline-offset-0 outline-transparent outline-solid",
          "focus:outline-accent-text focus:bg-bg focus:mr-4 focus:px-4 focus:inset-shadow focus:outline-2 focus:outline-offset-2",
        )}
        size={0}
        placeholder={placeholder}
        {...rest}
      />
    </label>
  );
}
