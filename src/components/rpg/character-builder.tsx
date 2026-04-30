import { useEffect, useState } from "react";
import { CharacterCard } from "@/components/rpg/character";
import { CharacterForm } from "@/components/rpg/forms/character-form";
import { AdventureContainer } from "@/components/rpg/forms/adventure-form";
import { useStore } from "@/components/rpg/store";
import { characterBuilds } from "@/data/character-builds";
import type { BuildMapping } from "@/types/builds";

function Container({ builds }: { builds: BuildMapping }) {
  const [show, setShow] = useState<boolean>(false);
  const name = useStore((state) => state.name);
  const level = useStore((state) => state.level);
  const build = useStore((state) => state.build);
  const setStats = useStore((state) => state.setStats);
  const reset = useStore((state) => state.reset);

  useEffect(() => {
    const { strength, agility, wisdom, magic } = builds[build];
    setStats(strength, agility, wisdom, magic);
  }, [build, builds, setStats]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col lg:flex-row gap-2">
        <CharacterCard
          name={name}
          level={level}
          build={build ? builds[build] : builds.thief}
        />
        {!show && <CharacterForm builds={builds} onSubmit={() => setShow((prev) => !prev)} />}
      </div>
      {show && (
        <AdventureContainer
          reset={() => {
            reset();
            setShow(false);
          }}
        />
      )}
    </div>
  );
}

export function CharacterBuilder() {
  const reset = useStore((state) => state.reset);

  useEffect(() => {
    return () => reset();
  }, [reset]);

  return (
    <div className="w-full max-w-5xl space-y-2">
      <Container builds={characterBuilds} />
    </div>
  );
}
