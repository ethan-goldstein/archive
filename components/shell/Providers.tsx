"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { SettingsSync } from "@/lib/settings/SettingsContext";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SettingsSync />
      {children}
    </MotionConfig>
  );
}
