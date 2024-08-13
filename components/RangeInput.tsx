import { useForkedRef } from "+hooks/useForkRef";
import { makeClass, tw } from "bun-tailwindcss" with { type: "macro" };
import { useEffect, useState, type ComponentPropsWithRef, type ElementRef } from "react";

export function RangeInput({ label, ref, ...rest }: { label: string } & ComponentPropsWithRef<"input">) {
  const [position, setPosition] = useState(NaN);
  const [value, setValue] = useState(NaN);
  const [localref, forkedref] = useForkedRef<ElementRef<"input">>(ref);
  useEffect(() => {
    const controller = new AbortController();
    function update() {
      const current = localref.current!;
      const value = (current.valueAsNumber - +current.min) / (+current.max - +current.min);
      setPosition(value);
      setValue(current.valueAsNumber);
    }
    localref.current!.addEventListener("input", update, { signal: controller.signal });
    update();
    return () => controller.abort();
  }, []);
  return (
    <label className={tw("flex h-11 items-center")}>
      <span className={tw("py-2 pl-4 text-sm")}>{label}</span>
      <div className={tw("relative mx-4 grid flex-1")}>
        <input
          className={makeClass(
            "range-input",
            "cursor-pointer appearance-none border-none bg-transparent !outline-none",
            "[&::-moz-range-track]:rounded-full [&::-webkit-slider-runnable-track]:rounded-full",
            "[&::-webkit-slider-runnable-track]:bg-bg [&::-moz-range-track]:bg-bg",
            "[&::-moz-range-track]:inset-shadow-sm [&::-webkit-slider-runnable-track]:inset-shadow-sm",
            "[&::-moz-range-track]:h-2 [&::-webkit-slider-runnable-track]:h-2",
            "[&::-moz-range-thumb]:transition-all [&::-webkit-slider-thumb]:transition-all",
            "[&::-webkit-slider-thumb]:bg-button [&::-webkit-slider-thumb]:-mt-1 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow",
            "focus-visible:[&::-webkit-slider-thumb]:outline-button focus-visible:[&::-webkit-slider-thumb]:outline-2 focus-visible:[&::-webkit-slider-thumb]:outline-offset-2 focus-visible:[&::-webkit-slider-thumb]:outline-solid",
            "[&::-moz-range-thumb]:bg-button [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow",
            "focus-visible:[&::-moz-range-thumb]:outline-button focus-visible:[&::-moz-range-thumb]:outline-2 focus-visible:[&::-moz-range-thumb]:outline-offset-2 focus-visible:[&::-moz-range-thumb]:outline-solid",
          )}
          type="range"
          {...rest}
          ref={forkedref}
        />
        {Number.isFinite(position) && (
          <div className={tw("pointer-events-none absolute inset-x-2 top-1")}>
            <div
              className={tw("text-button-text absolute inset-0 size-4 -translate-2 rounded-full text-center text-xs")}
              style={{ left: `${position * 100}%` }}
            >
              {value}
            </div>
          </div>
        )}
      </div>
    </label>
  );
}
