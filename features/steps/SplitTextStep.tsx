"use client";

import { useMemo } from "react";
import SplitText from "@/components/SplitText";

interface SplitTextStepProps {
  text?: string | (() => string);
}

export function SplitTextStep({ text }: SplitTextStepProps) {
  const resolvedText = useMemo(() => {
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
    <SplitText
      text={resolvedText}
      className="text-4xl font-semibold p-2 text-center text-amber-700"
      delay={70}
      duration={2}
      ease="bounce.out"
      splitType="chars"
      from={{ opacity: 0, y: 40 }}
      to={{ opacity: 1, y: 0 }}
      threshold={0.1}
      rootMargin="-100px"
      textAlign="center"
    />
  );
}
