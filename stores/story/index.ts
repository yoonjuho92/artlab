import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import {
  createWriterSlice,
  type WriterSlice,
} from "@/stores/story/writerSlice";
import {
  createCharacterSlice,
  type CharacterSlice,
} from "@/stores/story/characterSlice";

export type StoryState = WriterSlice &
  CharacterSlice & {
    resetAll: () => void;
  };

export const useStoryStore = create<StoryState>()(
  devtools(
    persist(
      (set, get, api) => ({
        ...createWriterSlice(set, get, api),
        ...createCharacterSlice(set, get, api),

        resetAll: () =>
          set({
            writerName: "",
            name: "",
            species: "",
            appearanceWords: ["", "", ""],
            appearanceSentence: "",
            personalityWords: ["", "", ""],
            personalitySentence: "",
          }),
      }),
      {
        name: "story-store",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
