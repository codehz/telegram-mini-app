import { useEventHandler } from "+hooks/useEventHandler";
import { makeClass, tw } from "bun-tailwindcss" with { type: "macro" };
import classNames from "classnames";
import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ElementRef,
  type ForwardedRef,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export function AnimatedList({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <div className={tw("contain-paint")}>
      <div className={tw("bg-divide -mt-px")}>
        {children}
        {footer}
      </div>
    </div>
  );
}

export namespace AnimatedList {
  export type ItemContainer = { startDelete(): void; element: HTMLDivElement };
  export const ItemContainer = forwardRef(function ItemContainer(
    {
      onDelete,
      onClick,
      children,
      className,
      style,
    }: {
      onDelete: () => Promise<unknown>;
      onClick?: MouseEventHandler<ElementRef<"div">>;
      children: ReactNode;
      className?: string;
      style?: CSSProperties;
    },
    ref: ForwardedRef<ItemContainer>,
  ) {
    const [deleting, setDeleting] = useState(false);
    const onTransitionEnd = useEventHandler(async () => {
      if (!deleting) {
        return;
      }
      try {
        await onDelete();
      } catch (e) {
        setDeleting(false);
        toast.error("删除失败", { description: e + "" });
      }
    });
    const element = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({
      startDelete() {
        setDeleting(true);
      },
      element: element.current!,
    }));
    return (
      <div
        inert={deleting}
        className={makeClass(
          "ItemContainer",
          "bg-secondary-bg relative mt-px h-11 contain-paint",
          "focus-visible-only:bg-button focus-visible-only:text-button-text focus-visible-only:[--active-color:var(--color-bg)]",
          "transition-all duration-200",
          "inert-only:mt-0 inert-only:h-0 inert-only:opacity-0",
        )}
        style={style}
        onTransitionEnd={onTransitionEnd}
        onClick={onClick}
        ref={element}
      >
        <div
          className={classNames(
            makeClass(
              "inner",
              "absolute inset-x-0 h-11",
              "pointer-events-none *:pointer-events-auto",
              "top-[50%] translate-y-[-50%]",
            ),
            className,
          )}
        >
          {children}
        </div>
      </div>
    );
  });
}
