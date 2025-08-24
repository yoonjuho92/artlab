"use client";

import { useMemo } from "react";
import TextType from "@/components/TextType";

export function TextTypeStep({ text }: { text?: string | (() => string) }) {
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
    <TextType
      text={[resolvedText]} // ✅ undefined면 ""가 들어감
      typingSpeed={75}
      showCursor={false}
      cursorCharacter="|"
      textColors={["text-black"]}
    />
  );
}
