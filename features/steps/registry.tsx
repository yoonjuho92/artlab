// features/steps/registry.tsx
import { WriterNameStep } from "./WriterNameStep";
import { TextTypeStep } from "./TextTypeStep";
import { SplitTextStep } from "./SplitTextStep";
import { CharacterSpeciesStep } from "./CharaterSpeciesStep";
import { TrueFocusStep } from "./TrueFocusStep";
import { CharacteristicsStep } from "./CharacteristicsStep";
import { CharacterSumStep } from "./CharacterSumStep";

export const StepRegistry = {
  TextType: TextTypeStep,
  WriterName: WriterNameStep,
  SplitText: SplitTextStep,
  CharacterSpecies: CharacterSpeciesStep,
  TrueFocus: TrueFocusStep,
  Characteristics: CharacteristicsStep,
  CharacterSum: CharacterSumStep,
} as const;
