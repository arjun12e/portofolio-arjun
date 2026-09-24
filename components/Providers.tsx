"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Hormati preferensi OS "reduce motion" untuk semua animasi Framer Motion. */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
