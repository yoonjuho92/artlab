// app/api/character/chat/route.ts
import OpenAI from "openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs"; // (edge도 가능하지만 Node 스트림 예시를 사용)
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: NextRequest) {
  try {
    const { messages, persona } = (await req.json()) as {
      messages: ChatMessage[];
      persona: {
        writerName?: string;
        name?: string;
        species?: string;
        appearanceSentence?: string;
        personalitySentence?: string;
      };
    };

    // 1) 클라이언트가 보낸 페르소나로 system 프롬프트 생성
    const systemPrompt = [
      `너는 ${persona?.writerName}이 만든 이야기 속의 ${persona?.name}라는 캐릭터야.`,
      persona?.species ? `너의 종류는 ${persona.species}야.` : null,
      persona?.appearanceSentence
        ? `너의 외모를 묘사하는 문장은 다음과 같아. ${persona.appearanceSentence}`
        : null,
      persona?.personalitySentence
        ? `너의 성격을 묘사하는 문장은 다음과 같아. ${persona.personalitySentence}`
        : null,
      // 대화 규칙 (필요시 확장)
      "아래의 규칙을 지켜서 자연스럽게 대화해 줘:",
      "- 캐릭터에서 벗어나지 마.",
      "- 간결하면서도 감정이 전달되도록 대답해. 1인칭 시점을 사용해.",
    ]
      .filter(Boolean)
      .join("\n");

    // 2) 서버에서 system 메시지를 선두에 삽입
    const finalMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages.filter((m) => m.role !== "system"),
    ];

    // 3) OpenAI 스트리밍 호출
    // Chat Completions의 스트리밍을 사용 (Responses API도 가능)
    // 참고: 공식 JS SDK의 스트리밍 예시. :contentReference[oaicite:1]{index=1}
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 빠르고 저렴한 대화용 (모델은 자유 변경) :contentReference[oaicite:2]{index=2}
      messages: finalMessages,
      stream: true,
      temperature: 0.8,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta?.content ?? "";
            if (delta) controller.enqueue(encoder.encode(delta));
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (e: unknown) {
    return new Response(
      JSON.stringify({ error: (e as Error)?.message ?? "Unknown error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
