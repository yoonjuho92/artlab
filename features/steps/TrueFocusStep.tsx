import React from "react";
import TrueFocus from "@/components/TrueFocus";
import { useMemo } from "react";

const TrueFocusStep = ({ text }: { text?: string | (() => string) }) => {
  const resolvedSentence = useMemo(() => {
    try {
      if (typeof text === "function") {
        return text() ?? "";
      }
      return text ?? "";
    } catch {
      return "";
    }
  }, [text]);
  return (
    <div className="space-y-4">
      <TrueFocus
        sentence={resolvedSentence}
        manualMode={false}
        blurAmount={5}
        borderColor="oklch(55.5% 0.163 48.998)"
        animationDuration={2}
        pauseBetweenAnimations={1}
      />
      <p>{"이제 함께 모험을 떠나 볼까요!"}</p>
    </div>
  );
};

export { TrueFocusStep };
