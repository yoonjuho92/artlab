"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useStoryStore } from "@/stores/story";
import { useShallow } from "zustand/react/shallow";
import { RefreshCw } from "lucide-react"; // ✅ 아이콘

export const CharacterSumStep = () => {
  const {
    writerName,
    species,
    appearanceWords,
    appearanceSentence,
    setAppearanceSentence,
    personalityWords,
    personalitySentence,
    setPersonalitySentence,
  } = useStoryStore(
    useShallow((s) => ({
      writerName: s.writerName,
      species: s.species,
      appearanceWords: s.appearanceWords,
      appearanceSentence: s.appearanceSentence,
      setAppearanceSentence: s.setAppearanceSentence,
      personalityWords: s.personalityWords,
      personalitySentence: s.personalitySentence,
      setPersonalitySentence: s.setPersonalitySentence,
    }))
  );

  const needAppearance =
    !appearanceSentence &&
    Array.isArray(appearanceWords) &&
    appearanceWords.length === 3;

  const needPersonality =
    !personalitySentence &&
    Array.isArray(personalityWords) &&
    personalityWords.length === 3;

  const shouldGenerate = needAppearance || needPersonality;

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const calledRef = useRef(false);

  const payload = useMemo(
    () => ({
      writerName,
      species,
      appearanceWords,
      personalityWords,
      appearanceSentence: appearanceSentence ?? null,
      personalitySentence: personalitySentence ?? null,
    }),
    [
      writerName,
      species,
      appearanceWords,
      personalityWords,
      appearanceSentence,
      personalitySentence,
    ]
  );

  useEffect(() => {
    if (!shouldGenerate) return;
    if (calledRef.current) return;
    calledRef.current = true;

    (async () => {
      try {
        setLoading(true);
        setErrMsg(null);

        const res = await fetch("/api/character/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Request failed");
        }

        const data: {
          appearanceSentence: string | null;
          personalitySentence: string | null;
        } = await res.json();

        if (data.appearanceSentence && needAppearance) {
          setAppearanceSentence(data.appearanceSentence);
        }
        if (data.personalitySentence && needPersonality) {
          setPersonalitySentence(data.personalitySentence);
        }
      } catch (e: unknown) {
        setErrMsg(
          e instanceof Error ? e.message : "문장 생성 중 오류가 발생했어요."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [
    shouldGenerate,
    needAppearance,
    needPersonality,
    payload,
    setAppearanceSentence,
    setPersonalitySentence,
  ]);

  // ✅ refresh 버튼 핸들러
  const handleRefresh = () => {
    // 기존 문장 초기화 → 새로 생성하도록 트리거
    setAppearanceSentence("");
    setPersonalitySentence("");
    calledRef.current = false; // 다시 호출 허용
  };

  return (
    <div className="text-start space-y-3">
      <div className="flex items-center justify-end">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-1 px-2 py-1 text-sm text-amber-700 hover:text-amber-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          새로고침
        </button>
      </div>

      <p>제가 생각한 당신의 캐릭터는 이런 캐릭터에요!</p>

      {loading && (needAppearance || needPersonality) ? (
        <p className="text-gray-500">
          당신의 캐릭터가 어떤 캐릭터일지 상상해 보고 있어요.
        </p>
      ) : (
        <>
          <p>당신의 캐릭터는 아마 이런 모습일 거예요</p>
          {appearanceSentence ? (
            <p className="text-gray-800">{appearanceSentence}</p>
          ) : (
            <p className="text-gray-400">외형 문장이 없습니다.</p>
          )}

          <p>성격은 아마 이런 성격이지 않을까요?</p>
          {personalitySentence ? (
            <p className="text-gray-800">{personalitySentence}</p>
          ) : (
            <p className="text-gray-400">성격 문장이 없습니다.</p>
          )}
        </>
      )}

      {errMsg && <p className="text-sm text-red-600">오류: {errMsg}</p>}
    </div>
  );
};
