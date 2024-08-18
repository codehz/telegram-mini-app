import { toast } from "sonner";

export async function asyncToast(fn: () => Promise<unknown>, ongoing: string, errmsg: string): Promise<boolean> {
  const id = toast.info(ongoing);
  try {
    await fn();
    return true;
  } catch (e) {
    toast.error(errmsg, { description: e + "" });
    return false;
  } finally {
    toast.dismiss(id);
  }
}
