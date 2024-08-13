import { BottomDialog } from "./BottomDialog";
import { useNavigatePush } from "./StackNavigator";
import { useCallback, type ReactNode } from "react";

export function useBottomConfirm() {
  const push = useNavigatePush();
  return useCallback(
    (
      title: string,
      {
        description,
        confirm,
        extra,
        dynamic = false,
      }: { description?: ReactNode; confirm: ReactNode; extra?: ReactNode; dynamic?: boolean },
    ) =>
      new Promise<void>((resolve, reject) => {
        push(
          <BottomDialog title={title} description={description} dynamic={dynamic} close="取消">
            {extra}
            <BottomDialog.Item destructive action={() => (resolve(), true)}>
              {confirm}
            </BottomDialog.Item>
          </BottomDialog>,
          { type: "bottom-sheet" },
        ).finally(() => reject());
      }),
    [push],
  );
}
