import { NumberInput } from "@ark-ui/react";
import { tw } from "bun-tailwindcss" with { type: "macro" };
import { useEffect, useMemo, useState, type ComponentPropsWithoutRef } from "react";

export function DurationInput({
  label,
  defaultValue,
  value = defaultValue ?? 0,
  ...rest
}: { label: string; value?: number; defaultValue?: number } & Omit<ComponentPropsWithoutRef<"input">, "type">) {
  const [hour, setHour] = useState((value / 60 / 60) | 0);
  const [minute, setMinute] = useState((value / 60) % 60 | 0);
  const [second, setSecond] = useState(value % 60);
  const computedValue = useMemo(() => hour * 60 * 60 + minute * 60 + second, [hour, minute, second]);
  return (
    <div className={tw("flex h-11 items-center px-4")}>
      <div className={tw("grow")}>{label}</div>
      <input {...rest} value={computedValue} readOnly type="hidden" />
      <Column max={23} defaultValue={hour} setValue={setHour} />
      <div>时</div>
      <Column max={59} defaultValue={minute} setValue={setMinute} />
      <div>分</div>
      <Column max={59} defaultValue={second} setValue={setSecond} />
      <div>秒</div>
    </div>
  );
}

function Column({ max, defaultValue, setValue }: { max: number; defaultValue: number; setValue(value: number): void }) {
  const [text, setText] = useState(defaultValue + "");
  useEffect(() => {
    const parsed = Number.parseInt(text, 10);
    if (!Number.isNaN(parsed) && parsed <= max) {
      setValue(parsed);
    }
  }, [text]);
  return (
    <NumberInput.Root
      min={0}
      max={max}
      defaultValue={defaultValue + ""}
      allowMouseWheel
      className={tw("mr-1 flex items-center tabular-nums")}
      onValueChange={(e) => setText(e.value)}
    >
      <NumberInput.Input
        className={tw("w-8 appearance-none self-stretch border-none pr-1 pl-2 text-right outline-none")}
        placeholder="0"
        size={0}
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
