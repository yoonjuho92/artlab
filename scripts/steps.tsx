import { useStoryStore } from "@/stores/story";

export type StepKind =
  | "TextType"
  | "Input"
  | "SplitText"
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
      kind: "Input";
      props: {
        label: string;
        valueKey: keyof ReturnType<typeof useStoryStore.getState>;
        setterKey: keyof ReturnType<typeof useStoryStore.getState>;
      };
    }
  | {
      page: number;
      kind: "SplitText";
      props: { text?: string | (() => string) };
    }
  | {
      page: number;
      kind: "TrueFocus";
      props: { text?: string | (() => string) };
    }
  | {
      page: number;
      kind: "Characteristics";
    }
  | {
      page: number;
      kind: "CharacterSum";
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
  {
    page: 3,
    kind: "Input",
    props: {
      label:
        "당신의 이름을 알려주세요!\n이름이 부담스럽다면 별명이나 당신이 좋아하는 물건도 괜찮아요!",
      valueKey: "writerName",
      setterKey: "setWriterName",
    },
  },
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
  {
    page: 6,
    kind: "Input",
    props: {
      label:
        "당신이 함께 여행을 떠날 주인공이 어떤 존재인지를 알려주세요.\n로봇? 사람? 동물? 그것도 아니라면...",
      valueKey: "species",
      setterKey: "setSpecies",
    },
  },
  {
    page: 7,
    kind: "Input",
    props: {
      label: "그 주인공의 이름을 알려주세요!",
      valueKey: "name",
      setterKey: "setName",
    },
  },
  {
    page: 8,
    kind: "TrueFocus",
    props: {
      text: () => {
        const writerName = useStoryStore.getState().writerName?.trim();
        const name = useStoryStore.getState().name?.trim();
        return `${writerName}님과 ${name}`;
      },
    },
  },
  {
    page: 9,
    kind: "TextType",
    props: {
      text: () => {
        const name = useStoryStore.getState().name?.trim();
        return `그 전에 ${
          name || "당신의 주인공"
        }에 대해 몇 가지만 더 알아볼까요?`;
      },
    },
  },
  { page: 10, kind: "Characteristics" },
  { page: 11, kind: "CharacterSum" },
  {
    page: 12,
    kind: "TextType",
    props: {
      text: "이제 왼쪽 캐릭터 탭에서\n당신이 만든 캐릭터와 이야기를 나눌 수 있어요!",
    },
  },
];
