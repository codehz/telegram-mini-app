import { tw } from "bun-tailwindcss" with { type: "macro" };
import classNames from "classnames";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

const dummy = () => () => void 0;
const getInitData = () => !!Telegram.WebApp.initData;
const getServerSnapshot = () => false;

export function LoginGuard({ children, fallback = <Error /> }: { children: ReactNode; fallback?: ReactNode }) {
  const logined = useSyncExternalStore(dummy, getInitData, getServerSnapshot);
  return logined ? children : fallback;
}

const Error = () => {
  const [next, setNext] = useState(false);
  useEffect(() => {
    setNext(true);
  }, []);
  return (
    <div
      className={classNames(
        tw("rounded bg-red-400 p-4 text-center text-white"),
        next ? tw("animate-appear") : tw("opacity-0"),
      )}
    >
      该页面仅限Telegram Mini App访问
    </div>
  );
};
