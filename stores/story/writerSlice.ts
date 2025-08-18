import type { StateCreator } from "zustand";

export type WriterSlice = {
  writerName: string;
  setWriterName: (name: string) => void;
  clearWriter: () => void;
};

export const createWriterSlice: StateCreator<WriterSlice> = (set) => ({
  writerName: "",
  setWriterName: (name) => set({ writerName: name }),
  clearWriter: () => set({ writerName: "" }),
});
