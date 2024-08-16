import { useSyncExternalStore } from "react";

function subscribeViewportHeightChange(fn: () => void) {
  Telegram.WebApp.onEvent("viewportChanged", fn);
  return () => {
    Telegram.WebApp.offEvent("viewportChanged", fn);
  };
}

function getViewportHeight() {
  return Telegram.WebApp.viewportHeight;
}

function getViewportBottom() {
  return window.innerHeight - Telegram.WebApp.viewportHeight;
}

function getViewportStableHeight() {
  return Telegram.WebApp.viewportStableHeight;
}

function getHeightServerSnapshot() {
  return Number.MAX_SAFE_INTEGER;
}

function getBottomServerSnapshot() {
  return 0;
}

export function useViewportHeight() {
  return useSyncExternalStore(subscribeViewportHeightChange, getViewportHeight, getHeightServerSnapshot);
}

export function useViewportBottom() {
  return useSyncExternalStore(subscribeViewportHeightChange, getViewportBottom, getBottomServerSnapshot);
}

export function useViewportStableHeight() {
  return useSyncExternalStore(subscribeViewportHeightChange, getViewportStableHeight, getHeightServerSnapshot);
}
