// app/character/chat/page.tsx
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStoryStore } from "@/stores/story"; // ✅ species/appearanceSentence/personalitySentence 들어있는 zustand
import { useShallow } from "zustand/shallow";

// messages는 [{role: 'user'|'assistant', content: string}, ...] 형태라고 가정
type ChatMessage = { role: "user" | "assistant"; content: string };

export default function CharacterChatPage() {
  const { writerName, name, species, appearanceSentence, personalitySentence } =
    useStoryStore(
      useShallow((s) => ({
        writerName: s.writerName ?? "",
        name: s.name ?? "",
        species: s.species ?? "",
        appearanceSentence: s.appearanceSentence ?? "",
        personalitySentence: s.personalitySentence ?? "",
      }))
    );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `안녕하세요. ${writerName} 작가님! 저는 당신의 이야기 ${name}에요. 오늘은 무슨 얘기를 해 볼까요?`,
    },
  ]);
  const [input, setInput] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);

  const listRef = useRef<HTMLDivElement>(null); // ✅ 채팅 리스트 컨테이너 ref
  const inputRef = useRef<HTMLInputElement>(null); // ✅ 입력창 ref (보수적 초기화)

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: input.trim() };
    setMessages((prev) => [
      ...prev,
      userMsg,
      { role: "assistant", content: "" },
    ]);
    setInput("");
    // ✅ 보수적 초기화: IME 등으로 가끔 남는 글자 방지
    if (inputRef.current) inputRef.current.value = "";
    setLoading(true);

    const persona = { species, appearanceSentence, personalitySentence };

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/character/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [
            // 서버에서 system을 넣을 것이므로 여기서는 user/assistant만 보냄
            ...messages,
            userMsg,
          ],
          persona,
        }),
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });

        // 마지막 assistant 메시지를 갱신
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: assistantText };
          return next;
        });
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ 응답 중 오류가 발생했어요.: ${err}` },
      ]);
    } finally {
      setLoading(false);
    }
  }, [
    input,
    messages,
    species,
    appearanceSentence,
    personalitySentence,
    loading,
  ]);

  // ✅ 새 메시지가 추가될 때마다 맨 아래로 스크롤
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!name) {
    return (
      <div className="h-screen w-full bg-amber-50 text-2xl text-amber-700 flex justify-center items-center">
        {`Day1에서 캐릭터 설정을 완료하면 당신이 만든 캐릭터와 대화할 수 있습니다!`}
      </div>
    );
  }

  return (
    <div className="mx-auto h-screen bg-amber-50 w-full p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">
        당신의 캐릭터와 이야기를 나눠 보세요
      </h1>

      <div
        ref={listRef}
        className="flex-1 flex flex-col gap-3 rounded-2xl h-full overflow-y-auto border p-4 bg-white"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "self-end max-w-[85%] rounded-xl bg-amber-50 px-3 py-2"
                : "self-start max-w-[85%] rounded-xl bg-gray-100 px-3 py-2"
            }
          >
            <p className="whitespace-pre-wrap">{m.content}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            const composing = e.nativeEvent?.isComposing || e.key === "Process";
            if (e.key === "Enter" && !e.shiftKey && !composing) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="메시지를 입력하세요…"
          className="flex-1 rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="rounded-xl bg-amber-700 text-white px-4 py-2 disabled:opacity-50"
        >
          보내기
        </button>
      </div>
    </div>
  );
}
