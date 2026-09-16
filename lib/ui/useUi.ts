"use client";
import { useSyncExternalStore } from "react";
import { uiStore } from "./uiStore";

export function useUi() {
  return useSyncExternalStore(uiStore.subscribe, uiStore.get, uiStore.getServer);
}
