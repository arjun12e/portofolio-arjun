"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Angka yang "menghitung naik" saat pertama kali terlihat. */
export function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduce) return;
    const format = (v: number) => `${Math.round(v).toLocaleString("id-ID")}${suffix}`;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, value, suffix, reduce]);

  // Nilai akhir di-render di server → tetap benar tanpa JS & untuk SEO.
  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}
