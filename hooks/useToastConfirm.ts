import { useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import { useToastDismiss } from "./useToastDismiss";

export function useToastConfirm() {
  const track = useToastDismiss();
  return useCallback(
    (
      message: string | ReactNode,
      { description, confirm, cancel }: { description?: ReactNode; confirm: ReactNode; cancel?: ReactNode },
    ) =>
      new Promise((resolve, reject) => {
        const dismiss = () => reject();
        track(
          toast.warning(message, {
            description,
            action: {
              label: confirm,
              onClick: resolve,
            },
            cancel: cancel ? { label: cancel, onClick: dismiss } : undefined,
            onDismiss: dismiss,
            duration: 5000,
            important: true,
          }),
        );
      }),
    [track],
  );
}
