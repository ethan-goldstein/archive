"use client";
import { useSyncExternalStore } from "react";
import { playerStore } from "./store";

export function usePlayer() {
  return useSyncExternalStore(playerStore.subscribe, playerStore.get, playerStore.getServer);
}
