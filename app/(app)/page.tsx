"use client";

import { useMemo, useState } from "react";
import { steps } from "@/scripts/steps";
import { StepRegistry } from "@/features/steps/registry";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [index, setIndex] = useState(0);
  const step = steps[index];
  const Cmp = step ? StepRegistry[step.kind] : null;
  const isInput =
    step?.kind &&
    ["WriterName", "CharacterSpecies", "Characteristics"].includes(step.kind);

  // 키는 페이지/스텝 기준으로 안정적으로
  const pageKey = useMemo(
    () => (step ? `page-${step.page}-${step.kind}` : "page-none"),
    [step]
  );

  if (!step || !Cmp) return null;

  const handlePrev = () => setIndex((i) => Math.max(0, i - 1));
  const handleNext = () => setIndex((i) => Math.min(steps.length - 1, i + 1));

  return (
    <div
      className={[
        "min-h-screen text-center flex flex-col justify-center items-center gap-2",
        isInput ? "bg-white" : "bg-amber-50",
        "transition-colors duration-500 ease-in-out",
      ].join(" ")}
    >
      <div className="flex flex-row justify-between w-full p-4 items-center">
        <ChevronLeft
          onClick={index === 0 ? undefined : handlePrev}
          size={60}
          className={`cursor-pointer text-amber-700 ${
            index === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-amber-800"
          }`}
          aria-disabled={index === 0}
        />

        <div className="w-2/3 max-w-full text-xl flex flex-col items-center">
          {/* 페이지는 값/로직 모름 — props만 전달 */}
          <Cmp key={pageKey} {...(step.props || {})} />
        </div>

        <ChevronRight
          onClick={index >= steps.length - 1 ? undefined : handleNext}
          size={60}
          className={`cursor-pointer text-amber-700 ${
            index >= steps.length - 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-amber-800"
          }`}
          aria-disabled={index >= steps.length - 1}
        />
      </div>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm text-gray-600">
          {index + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}
