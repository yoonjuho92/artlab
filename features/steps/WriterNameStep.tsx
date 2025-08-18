"use client";

import { useStoryStore } from "@/stores/story";

export function WriterNameStep() {
  const writerName = useStoryStore((s) => s.writerName ?? "");
  const setWriterName = useStoryStore((s) => s.setWriterName);

  return (
    <div className="w-full space-y-10">
      <label className="whitespace-pre-line block">
        {
          "당신의 이름을 말해주세요.\n별명이나 좋아하는 물건을 가르쳐 주셔도 좋습니다."
        }
      </label>
      <input
        className="w-full text-center px-3 bg-amber-50 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700"
        type="text"
        value={writerName}
        onChange={(e) => setWriterName(e.currentTarget.value)}
      />
    </div>
  );
}
