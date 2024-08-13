import { useEventHandler } from "+hooks/useEventHandler";
import { makeClass, tw } from "bun-tailwindcss" with { type: "macro" };
import { Children, useRef, type ElementRef, type FormEvent, type MouseEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { FieldSet } from "./FieldSet";
import { useNavigatePop } from "./StackNavigator";

const ButtonClass = makeClass(
  "BottomDialog-button",
  "flex h-11 items-center justify-center gap-2 !outline-none transition-colors",
  "focus-visible:text-bg",
  "not-[data-destructive]:text-accent-text not-[data-destructive]:focus-visible:bg-accent-text",
  "[data-destructive]:text-destructive-text [data-destructive]:focus-visible:bg-destructive-text",
);

export function BottomDialog({
  title,
  description,
  children,
  dynamic = false,
  close = "关闭",
  onSubmit,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  dynamic?: boolean;
  close?: ReactNode;
  onSubmit?: (event: FormEvent<ElementRef<"form">>) => unknown;
}) {
  const pop = useNavigatePop();
  const lock = useRef(false);
  const handleSubmit = useEventHandler(async (event: FormEvent<ElementRef<"form">>) => {
    event.preventDefault();
    if (!onSubmit || (await onSubmit(event))) pop();
  });
  return (
    <form className={tw("grid gap-4 p-4")} onSubmit={handleSubmit}>
      <FieldSet dynamic={dynamic}>
        <div className={tw("space-y-1 py-3 px-2 text-center text-sm")}>
          <h1 className={tw("font-bold")}>{title}</h1>
          {!!description && <div className={tw("text-hint")}>{description}</div>}
        </div>
        {Children.map(children, (child) => {
          if (isButtonDialogItem(child)) {
            return (
              <button
                key={child.key}
                type="button"
                data-destructive={child.props.destructive}
                className={ButtonClass}
                onClick={async (event) => {
                  if (lock.current) return;
                  try {
                    lock.current = true;
                    if (await child.props.action(event)) pop();
                  } catch (e) {
                    toast.error(e + "");
                  } finally {
                    lock.current = false;
                  }
                }}
              >
                {child.props.children}
              </button>
            );
          } else if (isButtonDialogSubmit(child)) {
            return (
              <button key={child.key} type="submit" className={ButtonClass}>
                {child.props.children}
              </button>
            );
          } else {
            return child;
          }
        })}
      </FieldSet>
      <FieldSet>
        <button
          className={tw(
            "text-accent-text focus-visible:bg-button focus-visible:text-bg flex h-11 items-center justify-center gap-2 rounded-2xl font-bold !outline-none transition-colors",
          )}
          onClick={pop}
        >
          {close}
        </button>
      </FieldSet>
    </form>
  );
}

function isButtonDialogItem(
  element: unknown,
): element is Omit<JSX.Element, "props"> & { props: ButtonDialogItemProps } {
  return (element && typeof element === "object" && "type" in element && element.type === BottomDialog.Item) as boolean;
}
function isButtonDialogSubmit(
  element: unknown,
): element is Omit<JSX.Element, "props"> & { props: ButtonDialogSubmitProps } {
  return (element &&
    typeof element === "object" &&
    "type" in element &&
    element.type === BottomDialog.Submit) as boolean;
}

type ButtonDialogItemProps = {
  children: ReactNode;
  action: (event: MouseEvent) => unknown;
  destructive?: boolean;
};
type ButtonDialogSubmitProps = {
  children: ReactNode;
};
BottomDialog.Item = function ButtonDialogItem(_: ButtonDialogItemProps) {
  return null;
};
BottomDialog.Submit = function ButtonDialogSubmit(_: ButtonDialogSubmitProps) {
  return null;
};
