import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs"; // (옵션) edge도 가능하지만 SDK 호환은 nodejs가 편함

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Payload = {
  writerName?: string;
  name?: string;
  species?: string;
  appearanceWords?: string[]; // 길이 3
  personalityWords?: string[]; // 길이 3
  appearanceSentence?: string | null;
  personalitySentence?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;

    const needAppearance =
      !body.appearanceSentence &&
      Array.isArray(body.appearanceWords) &&
      body.appearanceWords.length === 3;

    const needPersonality =
      !body.personalitySentence &&
      Array.isArray(body.personalityWords) &&
      body.personalityWords.length === 3;

    // 이미 둘 다 있으면 그대로 반환
    if (!needAppearance && !needPersonality) {
      return NextResponse.json(
        {
          appearanceSentence: body.appearanceSentence ?? null,
          personalitySentence: body.personalitySentence ?? null,
        },
        { status: 200 }
      );
    }

    const sys = `너는 아동/청소년용 이야기 캐릭터 설정 문장을 만드는 도우미야.
과격하거나 부적절한 표현은 피하고, 긍정적인 뉘앙스로 써.`;

    const context: string[] = [];
    if (body.name) context.push(`이름: ${body.name}`);
    if (body.species) context.push(`종/형태: ${body.species}`);
    if (needAppearance && body.appearanceWords)
      context.push(`외형 단어(3개): ${body.appearanceWords.join(", ")}`);
    if (needPersonality && body.personalityWords)
      context.push(`성격 단어(3개): ${body.personalityWords.join(", ")}`);
    if (body.writerName) context.push(`작성자(참고): ${body.writerName}`);

    const user = `아래 정보를 바탕으로 "없는 문장만" 작성해.
- 출력은 JSON 한 객체만: { "appearanceSentence": string|null, "personalitySentence": string|null }
- 이미 있는 문장은 null로 두고, 없는 것만 새로 작성.
- 2문장 이상 5문장 이하로 작성해서 너무 길지 않게 해 줘 (변화를 주는 건 좋아).
- '해요'체로 작성해 줘.
- 각 문장은 주어진 외형 단어/성격 단어 3가지를 모두 활용한 문장이어야 해.

정보:
${context.join("\n")}`;

    // 최신 SDK: chat.completions 또는 responses 중 하나 사용
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    let parsed: {
      appearanceSentence: string | null;
      personalitySentence: string | null;
    };
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = { appearanceSentence: null, personalitySentence: null };
    }

    // 안전하게 후처리(여전히 필요 없는 값은 null 유지)
    const appearanceSentence = needAppearance
      ? parsed.appearanceSentence ?? null
      : body.appearanceSentence ?? null;
    const personalitySentence = needPersonality
      ? parsed.personalitySentence ?? null
      : body.personalitySentence ?? null;

    return NextResponse.json(
      { appearanceSentence, personalitySentence },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate sentences" },
      { status: 500 }
    );
  }
}
