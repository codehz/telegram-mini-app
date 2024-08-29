import { toast } from "sonner";

export async function asyncToast(
  promise: Promise<unknown> | (() => Promise<unknown>),
  ongoing: string,
  errmsg: string,
): Promise<boolean> {
  const id = toast.info(ongoing);
  try {
    await (typeof promise === "function" ? promise() : promise);
    return true;
  } catch (e) {
    toast.error(errmsg, { description: e + "" });
    return false;
  } finally {
    toast.dismiss(id);
  }
}
