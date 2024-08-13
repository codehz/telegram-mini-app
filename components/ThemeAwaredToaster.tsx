import { makeClass } from "bun-tailwindcss" with { type: "macro" };
import classNames from "classnames";
import { memo } from "react";
import { Toaster } from "sonner";
import { useTelegramColorScheme } from "../hooks/useTelegramTheme";

export const ThemeAwaredToaster = memo(() => {
  const scheme = useTelegramColorScheme();
  return (
    <Toaster
      theme={scheme}
      position="top-center"
      cn={classNames}
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: makeClass(
            "toast",
            "bg-button grid gap-2 rounded-lg p-4 shadow-xl [&[data-sonner-toast][data-expanded='false'][data-front='false']]:*:pointer-events-none [&[data-sonner-toast][data-expanded='false'][data-front='false']]:*:opacity-0",
          ),
          error: makeClass(
            "error",
            "bg-destructive-text grid-cols-[auto_1fr] items-center text-white [--active-color:var(--color-destructive-text)]",
          ),
          warning: makeClass(
            "warning",
            "bg-destructive-text grid-cols-[auto_1fr] items-center text-white [--active-color:var(--color-destructive-text)]",
          ),
          success: makeClass(
            "success",
            "grid-cols-[auto_1fr] items-center bg-green-600 text-white [--active-color:var(--color-green-600)]",
          ),
          info: makeClass("info", "grid-cols-[auto_1fr] items-center text-white"),
          title: makeClass("title", "text-button-text"),
          description: makeClass("description", "text-button-text text-sm"),
          closeButton: makeClass("closeButton", "bg-destructive-text hover:text-destructive-text text-white"),
          icon: makeClass("icon", "text-white"),
          actionButton: makeClass(
            "actionButton",
            "col-span-full rounded-md bg-white py-1 px-2 text-[var(--active-color,var(--color-accent-text))]",
          ),
          cancelButton: makeClass(
            "cancelButton",
            "col-span-full rounded-md border-1 border-solid border-white py-1 px-2",
          ),
        },
      }}
    />
  );
});
