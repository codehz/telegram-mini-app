import { useEventHandler } from "+hooks/useEventHandler";
import { Portal, Select } from "@ark-ui/react";
import { makeClass, tw } from "bun-tailwindcss" with { type: "macro" };
import { Children, type ReactNode } from "react";

function boundary() {
  return { x: 0, y: 0, width: window.innerWidth, height: Telegram.WebApp.viewportStableHeight };
}

const positioning = {
  placement: "bottom-end" as const,
  flip: ["top-end" as const],
  overlap: true,
  slide: true,
  boundary,
};

export function SelectControl<T extends string = string>({
  name,
  label,
  placeholder,
  clear,
  children,
  required = false,
  disabled = false,
  value,
  onValueChange,
  items = Children.map(children, (item) => {
    if (isSelectControlItem(item)) {
      return item.props;
    }
    return null;
  }) ?? [],
}: {
  name?: string;
  label: string;
  placeholder: string;
  clear?: string;
  children?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  value?: T;
  onValueChange?: (value: T) => void;
  items?: ButtonDialogItemProps[];
}) {
  const handleValueChange = onValueChange
    ? useEventHandler((e: { value: string[] }) => onValueChange((e.value[0] ?? "") as T))
    : undefined;
  return (
    <Select.Root
      name={name}
      items={items}
      className={tw("flex items-center")}
      positioning={positioning}
      required={required}
      disabled={disabled}
      value={value ? [value] : undefined}
      onValueChange={handleValueChange}
    >
      <Select.Control className={tw("flex grow")}>
        <Select.Trigger
          className={makeClass(
            "SelectTrigger",
            "flex h-11 grow items-center justify-between pr-4",
            "focus-visible:bg-button !outline-none transition-colors focus-visible:[--active-color:var(--color-button-text)]",
            "data-[placeholder-shown]:text-[var(--active-color,var(--color-hint))]",
          )}
        >
          <Select.Label
            className={makeClass(
              "SelectLabel",
              "pointer-events-none py-2 pr-2 pl-4 text-sm text-[var(--active-color,var(--color-text))]",
            )}
          >
            {label}
          </Select.Label>
          <div className={tw("flex grow items-center justify-end")}>
            <Select.ValueText placeholder={placeholder} className={tw("ellipsis mr-2 text-right text-sm")} />
            <Select.Indicator
              className={makeClass(
                "SelectIndicator",
                "size-4 fill-[var(--active-color,var(--color-text))] transition-transform data-[state=open]:rotate-180",
              )}
            >
              <svg viewBox="0 0 24 24">
                <path d="m4 10 8 8 8-8-2-2-6 6-6-6z" />
              </svg>
            </Select.Indicator>
          </div>
        </Select.Trigger>
        {clear && <Select.ClearTrigger>{clear}</Select.ClearTrigger>}
      </Select.Control>
      <Portal>
        <Select.Positioner className={tw("pointer-events-children")}>
          <Select.Content
            className={makeClass(
              "SelectContent",
              "bg-secondary-bg border-divide divide-divide !block divide-y rounded-md border-1 shadow-md contain-paint",
              "outline-button outline-offset-0 transition-all focus-visible:outline-2 focus-visible:outline-offset-2",
              "[[hidden]]:animate-disappear animate-appear [[hidden]]:pointer-events-none",
            )}
          >
            {items.map((item) => (
              <Select.Item
                key={item.value}
                item={item}
                className={makeClass(
                  "SelectItem",
                  "flex items-center py-2 px-4 transition-all",
                  "data-[highlighted]:bg-button data-[highlighted]:text-button-text",
                )}
              >
                <Select.ItemText>{item.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
      <Select.HiddenSelect />
    </Select.Root>
  );
}

function isSelectControlItem(
  element: unknown,
): element is Omit<JSX.Element, "props"> & { props: ButtonDialogItemProps } {
  return (element &&
    typeof element === "object" &&
    "type" in element &&
    element.type === SelectControl.Item) as boolean;
}

type ButtonDialogItemProps = { label: string; value: string; disabled?: boolean };

export namespace SelectControl {
  export function Item({}: ButtonDialogItemProps) {
    return null;
  }
}
