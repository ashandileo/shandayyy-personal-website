"use client";

import { useState, useEffect, useCallback } from "react";

interface TypewriterOptions {
  words: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDelay?: number;
}

export function useTypewriter({
  words,
  typeSpeed = 80,
  deleteSpeed = 50,
  pauseDelay = 2000,
}: TypewriterOptions) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const current = words[wordIndex] ?? "";

    if (!isDeleting) {
      // Typing
      if (text.length < current.length) {
        return { next: current.slice(0, text.length + 1), delay: typeSpeed };
      }
      // Finished typing — pause then start deleting
      return { next: text, delay: pauseDelay, startDelete: true };
    }

    // Deleting
    if (text.length > 0) {
      return { next: current.slice(0, text.length - 1), delay: deleteSpeed };
    }
    // Finished deleting — move to next word
    return { next: "", delay: typeSpeed, nextWord: true };
  }, [text, wordIndex, isDeleting, words, typeSpeed, deleteSpeed, pauseDelay]);

  useEffect(() => {
    if (words.length === 0) return;

    const { next, delay, startDelete, nextWord } = tick();

    const timer = setTimeout(() => {
      setText(next);
      if (startDelete) setIsDeleting(true);
      if (nextWord) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [tick, words]);

  return text;
}
