import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export function useToastDismiss() {
  const ref = useRef<(string | number)[]>([]);
  useEffect(() => () => {
    ref.current.map((key) => toast.dismiss(key));
  });
  return useCallback((id: string | number) => {
    ref.current.push(id);
  }, []);
}
