import { useStoryStore } from "@/stores/story";

export type StepKind =
  | "TextType"
  | "WriterName"
  | "SplitText"
  | "CharacterSpecies"
  | "TrueFocus"
  | "Characteristics"
  | "CharacterSum";

export type Step =
  | {
      page: number;
      kind: "TextType";
      props: { text?: string | (() => string) };
    }
  | {
      page: number;
      kind: "WriterName";
      props?: Record<string, never>;
    }
  | {
      page: number;
      kind: "SplitText";
      props: { text?: string | (() => string) };
    }
  | {
      page: number;
      kind: "CharacterSpecies";
      props?: Record<string, never>;
    }
  | {
      page: number;
      kind: "TrueFocus";
      props: { text?: string | (() => string) };
    }
  | {
      page: number;
      kind: "Characteristics";
      props?: Record<string, never>;
    }
  | {
      page: number;
      kind: "CharacterSum";
      props?: Record<string, never>;
    };

export const steps: Step[] = [
  {
    page: 1,
    kind: "TextType",
    props: {
      text: "반갑습니다.\n저는 당신의 이야기를 만드는 걸 도와줄 AI입니다.",
    },
  },
  {
    page: 2,
    kind: "TextType",
    props: { text: "모험을 시작하기 전에 몇 가지 질문을 드릴게요." },
  },
  { page: 3, kind: "WriterName" },
  {
    page: 4,
    kind: "SplitText",
    props: {
      text: () => {
        const name = useStoryStore.getState().writerName?.trim();
        return `${name || "작가"}님, 안녕하세요!`;
      },
    },
  },
  {
    page: 5,
    kind: "TextType",
    props: {
      text: () => {
        const name = useStoryStore.getState().writerName?.trim();
        return `이제 ${
          name || "작가"
        }님과 함께 여행을 떠날\n모험의 주인공에 대해 알려주세요!`;
      },
    },
  },
  { page: 6, kind: "CharacterSpecies" },
  {
    page: 7,
    kind: "TrueFocus",
    props: {
      text: () => {
        const name = useStoryStore.getState().writerName?.trim();
        const species = useStoryStore.getState().species?.trim();
        return `${name}님과 ${species}`;
      },
    },
  },
  {
    page: 8,
    kind: "TextType",
    props: {
      text: () => {
        const species = useStoryStore.getState().species?.trim();
        return `그 전에 ${
          species || "당신의 주인공"
        }에 대해 몇 가지만 더 알아볼까요?`;
      },
    },
  },
  { page: 9, kind: "Characteristics" },
  { page: 10, kind: "CharacterSum" },
  {
    page: 11,
    kind: "TextType",
    props: {
      text: "이제 왼쪽 캐릭터 탭에서\n당신이 만든 캐릭터와 이야기를 나눌 수 있어요!",
    },
  },
];
