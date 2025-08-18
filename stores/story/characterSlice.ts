import type { StateCreator } from "zustand";

export type CharacterSlice = {
  // 1) 캐릭터의 종
  species: string;
  setSpecies: (s: string) => void;

  // 2) 외모를 묘사하는 세 단어
  appearanceWords: [string, string, string];
  setAppearanceWords: (a: [string, string, string]) => void;

  // 3) 세 단어 기반 외모 문장
  appearanceSentence: string;
  setAppearanceSentence: (sentence: string) => void;

  // 4) 성격을 묘사하는 세 단어
  personalityWords: [string, string, string];
  setPersonalityWords: (p: [string, string, string]) => void;

  // 5) 세 단어 기반 성격 문장
  personalitySentence: string;
  setPersonalitySentence: (sentence: string) => void;

  clearCharacter: () => void;
};

export const createCharacterSlice: StateCreator<CharacterSlice> = (set) => ({
  species: "",
  setSpecies: (s) => set({ species: s }),

  appearanceWords: ["", "", ""],
  setAppearanceWords: (a) => set({ appearanceWords: a }),

  appearanceSentence: "",
  setAppearanceSentence: (sentence) => set({ appearanceSentence: sentence }),

  personalityWords: ["", "", ""],
  setPersonalityWords: (p) => set({ personalityWords: p }),

  personalitySentence: "",
  setPersonalitySentence: (sentence) => set({ personalitySentence: sentence }),

  clearCharacter: () =>
    set({
      species: "",
      appearanceWords: ["", "", ""],
      appearanceSentence: "",
      personalityWords: ["", "", ""],
      personalitySentence: "",
    }),
});
