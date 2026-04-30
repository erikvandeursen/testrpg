export type Build = {
  weapon: string;
  upgradedWeapon: string;
  armor: string;
  upgradedArmor: string;
  strength: number;
  agility: number;
  wisdom: number;
  magic: number;
  berserk?: boolean;
};

export type BuildName = "thief" | "knight" | "mage" | "brigadier";

export type BuildMapping = Record<BuildName, Build>;

export interface CharacterStore {
  name: string;
  level: number;
  build: BuildName;
  strength: number;
  agility: number;
  wisdom: number;
  magic: number;
  berserk: boolean;
  setName: (name: string) => void;
  setLevel: (level: number) => void;
  setBuild: (build: BuildName) => void;
  setStats: (strength: number, agility: number, wisdom: number, magic: number) => void;
  increaseLevel: () => void;
  activateBerserk: () => void;
  reset: () => void;
}
