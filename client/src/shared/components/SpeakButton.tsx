import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

interface SpeakButtonProps {
  text: string;
  lang?: string;
  className?: string;
  rate?: number;
  pitch?: number;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  lang = "en-US",
  className = "",
  rate = 0.9,
  pitch = 1,
}) => {
  const { speak, cancel, speaking, supported } = useSpeechSynthesis();

  if (!supported) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) {
      cancel();
    } else {
      speak(text, { lang, rate, pitch });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        p-2 rounded-full transition-colors
        ${
          speaking
            ? "bg-red-100 text-red-600 hover:bg-red-200"
            : "bg-blue-100 text-blue-600 hover:bg-blue-200"
        }
        ${className}
      `}
      title={speaking ? "Stop speaking" : "Listen to pronunciation"}
      aria-label={speaking ? "Stop speaking" : "Listen to pronunciation"}
    >
      {speaking ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
    </button>
  );
};
