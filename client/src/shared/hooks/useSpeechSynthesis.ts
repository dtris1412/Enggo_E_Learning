import { useState, useEffect, useCallback } from "react";

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);
    }
  }, []);

  const speak = useCallback(
    (
      text: string,
      options?: {
        lang?: string;
        rate?: number;
        pitch?: number;
        volume?: number;
      },
    ) => {
      if (!supported || !text) {
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set options
      utterance.lang = options?.lang || "en-US";
      utterance.rate = options?.rate || 0.9;
      utterance.pitch = options?.pitch || 1;
      utterance.volume = options?.volume || 1;

      // Event handlers
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [supported],
  );

  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  return {
    speak,
    cancel,
    speaking,
    supported,
  };
};
