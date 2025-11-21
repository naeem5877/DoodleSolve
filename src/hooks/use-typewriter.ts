'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * A high-performance typewriter hook that uses time-based chunking
 * instead of fixed intervals to ensure constant speed regardless of
 * text length or main thread load.
 * 
 * @param text The text to type out
 * @param speedMsPerChar Target speed in milliseconds per character (lower is faster)
 */
export function useTypewriter(text: string, speedMsPerChar = 2) {
  const [displayedText, setDisplayedText] = useState('');
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number>();
  const textRef = useRef(text);

  // Update ref when text changes to avoid stale closures in the animation loop
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    // Reset state when text input changes significantly or is cleared
    if (!text) {
      setDisplayedText('');
      startTimeRef.current = null;
      return;
    }

    // If we're already displaying this exact text (fully), don't restart
    if (displayedText === text) {
      return;
    }

    // Start fresh if it's a new string
    setDisplayedText('');
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      // Calculate how many chars should be shown based on elapsed time
      const targetLength = Math.floor(elapsed / speedMsPerChar);

      if (targetLength >= textRef.current.length) {
        setDisplayedText(textRef.current);
        // Animation complete
      } else {
        setDisplayedText(textRef.current.slice(0, targetLength));
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [text, speedMsPerChar]);

  return displayedText;
}
