import { NumberInput } from "@ark-ui/react";
import { makeClass, tw } from "bun-tailwindcss" with { type: "macro" };
import classNames from "classnames";
import type { ComponentProps } from "react";

function MyNumberInput({
  label,
  className,
  placeholder,
  ...props
}: { label?: string; placeholder?: string } & ComponentProps<typeof NumberInput.Root>) {
  return (
    <NumberInput.Root {...props} className={classNames(tw("flex items-center pr-4"), className)}>
      <NumberInput.Label className={tw("py-2 pl-4 text-sm")}>{label}</NumberInput.Label>
      <NumberInput.Input
        placeholder={placeholder}
        className={makeClass(
          "NumberInput",
          "relative z-10 my-2 ml-2 flex-1 rounded-full border-none py-1 pr-2 pl-8 text-right text-sm tabular-nums transition-all",
          "placeholder:text-hint placeholder:font-extralight",
          "outline-0 outline-offset-0 outline-transparent outline-solid",
          "focus-within:outline-accent-text focus-within:bg-bg focus-within:mr-4 focus-within:px-4 focus-within:inset-shadow focus-within:outline-2 focus-within:outline-offset-2",
        )}
      />
      <NumberInput.Control className={tw("flex w-4 flex-col fill-none stroke-current stroke-2")}>
        <NumberInput.IncrementTrigger>
          <svg viewBox="0 0 24 24">
            <path d="m18 15l-6-6l-6 6" />
          </svg>
        </NumberInput.IncrementTrigger>
        <NumberInput.DecrementTrigger>
          <svg viewBox="0 0 24 24">
            <path d="m6 9l6 6l6-6" />
          </svg>
        </NumberInput.DecrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  );
}

export { MyNumberInput as NumberInput };
