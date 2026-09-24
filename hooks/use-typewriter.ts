"use client";

import { useEffect, useState } from "react";

interface TypewriterOptions {
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  /** Jika true (mis. prefers-reduced-motion), tampilkan kata tanpa animasi. */
  disabled?: boolean;
}

/**
 * Efek ketik berulang: ketik → jeda → hapus → kata berikutnya.
 * Dimulai dari kata pertama yang utuh agar HTML server & client identik
 * (tanpa hydration mismatch) dan tetap terbaca tanpa JavaScript.
 */
export function useTypewriter(
  words: readonly string[],
  { typeSpeed = 70, deleteSpeed = 35, pause = 1600, disabled = false }: TypewriterOptions = {}
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(words[0] ?? "");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (disabled || words.length === 0) return;
    const word = words[index % words.length];

    let delay = deleting ? deleteSpeed : typeSpeed;
    if (!deleting && text === word) delay = pause;

    const id = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setText(word.slice(0, text.length + (deleting ? -1 : 1)));
      }
    }, delay);
    return () => clearTimeout(id);
  }, [words, index, text, deleting, typeSpeed, deleteSpeed, pause, disabled]);

  return text;
}
