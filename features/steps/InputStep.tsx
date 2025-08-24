"use client";

import { useStoryStore } from "@/stores/story";

export function InputStep({
  label,
  valueKey,
  setterKey,
}: {
  label: string;
  valueKey: keyof ReturnType<typeof useStoryStore.getState>;
  setterKey: keyof ReturnType<typeof useStoryStore.getState>;
}) {
  // store에서 동적 key로 꺼내기
  const value = useStoryStore((s) => (s[valueKey] as string) ?? "");
  const setValue = useStoryStore((s) => s[setterKey] as (v: string) => void);

  return (
    <div className="w-full space-y-10">
      <label className="whitespace-pre-line block">{label}</label>
      <input
        className="w-full text-center px-3 bg-amber-50 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700"
        type="text"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
      />
    </div>
  );
}
