import React, { useMemo } from "react";
import { useStoryStore } from "@/stores/story";
import SplitTextOrig from "@/components/SplitText";

// 1) 메모 버전
const SplitText = React.memo(SplitTextOrig);

export const CharacteristicsStep: React.FC = () => {
  const name = useStoryStore((s) => s.name ?? "");
  const appearanceWords = useStoryStore((s) => s.appearanceWords);
  const setAppearanceWords = useStoryStore(
    (s) => s.setAppearanceWords as (next: string[]) => void
  );
  const personalityWords = useStoryStore((s) => s.personalityWords);
  const setPersonalityWords = useStoryStore(
    (s) => s.setPersonalityWords as (next: string[]) => void
  );

  const ensure3 = (arr?: string[]) =>
    Array.from({ length: 3 }, (_, i) => (arr && arr[i]) ?? "");
  const aWords = ensure3(appearanceWords);
  const pWords = ensure3(personalityWords);

  const updateAt = (
    current: string[],
    setter: (next: string[]) => void,
    index: number,
    value: string
  ) => {
    const next = [...ensure3(current)];
    next[index] = value;
    setter(next);
  };

  // 2) SplitText에 전달할 객체 props를 안정화
  const splitProps = useMemo(
    () => ({
      className: "p-2 text-center text-amber-700",
      delay: 70,
      duration: 2,
      ease: "bounce.out" as const,
      splitType: "chars" as const,
      from: { opacity: 0, y: 40 },
      to: { opacity: 1, y: 0 },
      threshold: 0.1,
      rootMargin: "-100px",
      textAlign: "center" as const,
    }),
    []
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-10">
      {/* species가 바뀔 때만 text prop이 바뀌므로, 그때만 리렌더/리애니메이션 */}
      <SplitText
        text={`당신의 모험에 함께할 ${name}의 외모와 성격을 알려주세요.`}
        {...splitProps}
      />

      {/* 외형 단어 */}
      <section className="space-y-4">
        <p>{name}는 어떤 외모를 가지고 있나요?</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {aWords.map((w, i) => (
            <input
              key={`appearance-${i}`}
              type="text"
              value={w}
              onChange={(e) =>
                updateAt(appearanceWords, setAppearanceWords, i, e.target.value)
              }
              placeholder={`외형 #${i + 1}`}
              className="w-full text-center px-3 bg-amber-50 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          ))}
        </div>
      </section>

      {/* 성격 단어 */}
      <section className="space-y-4">
        <div>{name}는 어떤 성격을 가지고 있나요?</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pWords.map((w, i) => (
            <input
              key={`personality-${i}`}
              type="text"
              value={w}
              onChange={(e) =>
                updateAt(
                  personalityWords,
                  setPersonalityWords,
                  i,
                  e.target.value
                )
              }
              placeholder={`성격 #${i + 1}`}
              className="w-full text-center px-3 bg-amber-50 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700"
            />
          ))}
        </div>
      </section>
    </div>
  );
};
