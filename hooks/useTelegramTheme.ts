import { useSyncExternalStore } from "react";

function subscribeTelegramThemeChange(fn: () => void) {
  Telegram.WebApp.onEvent("themeChanged", fn);
  return () => {
    Telegram.WebApp.offEvent("themeChanged", fn);
  };
}

function getTelegramTheme() {
  return Telegram.WebApp.themeParams;
}

function getTelegramColorScheme() {
  return Telegram.WebApp.colorScheme;
}

const defaultThemeParams: ThemeParams = {};

export function useTelegramTheme() {
  return useSyncExternalStore(
    subscribeTelegramThemeChange,
    getTelegramTheme,
    (): ThemeParams => defaultThemeParams,
  );
}

export function useTelegramColorScheme() {
  return useSyncExternalStore(
    subscribeTelegramThemeChange,
    getTelegramColorScheme,
    (): "light" | "dark" => "light dark" as any,
  );
}
