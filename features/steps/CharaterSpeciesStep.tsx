"use client";

import { useStoryStore } from "@/stores/story";
import DecryptedText from "@/components/DecryptedText";

export function CharacterSpeciesStep() {
  const characterSpecies = useStoryStore((s) => s.species ?? "");
  const setCharacterSpecies = useStoryStore((s) => s.setSpecies);

  return (
    <div className="w-full space-y-10">
      <div className="mt-4">
        <DecryptedText
          text="당신과 함께 여행을 떠날 존재는 어떤 존재인가요?"
          animateOn="view"
          speed={50}
          revealDirection="start"
          sequential={true}
        />
        <br />
        <DecryptedText
          text="인간? 동물? 로봇? 혹은 다른 생명체?"
          animateOn="view"
          speed={50}
          revealDirection="start"
          sequential={true}
        />
      </div>
      <input
        className="w-full text-center px-3 bg-amber-50 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700"
        type="text"
        value={characterSpecies}
        onChange={(e) => setCharacterSpecies(e.currentTarget.value)}
      />
    </div>
  );
}
