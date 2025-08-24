// features/steps/registry.tsx
import { InputStep } from "./InputStep";
import { TextTypeStep } from "./TextTypeStep";
import { SplitTextStep } from "./SplitTextStep";
import { TrueFocusStep } from "./TrueFocusStep";
import { CharacteristicsStep } from "./CharacteristicsStep";
import { CharacterSumStep } from "./CharacterSumStep";

export const StepRegistry = {
  TextType: TextTypeStep,
  Input: InputStep,
  SplitText: SplitTextStep,
  TrueFocus: TrueFocusStep,
  Characteristics: CharacteristicsStep,
  CharacterSum: CharacterSumStep,
} as const;
