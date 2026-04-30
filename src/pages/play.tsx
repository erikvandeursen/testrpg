import { CharacterBuilder } from "@/components/rpg/character-builder";

export default function PlayPage() {
  return (
    <div className="flex flex-col items-center w-full space-y-4 sm:-mt-20">
      <div className="text-center">
        <h1 className="max-w-3xl text-5xl font-extrabold md:text-6xl lg:text-7xl tracking-tight leading-none bg-gradient-to-tr from-blue-400 to-blue-800 bg-clip-text text-transparent">
          TestRPG
        </h1>
        <h2 className="max-w-prose sm:text-lg text-slate-700 dark:text-slate-200">
          Choose a build and level up your character!
        </h2>
      </div>
      <CharacterBuilder />
    </div>
  );
}
