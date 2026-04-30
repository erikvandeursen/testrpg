import type { BuildMapping } from "@/types/builds";

export const characterBuilds: BuildMapping = {
  thief: {
    weapon: "knife",
    upgradedWeapon: "katana",
    armor: "leather_armor",
    upgradedArmor: "silver_armor",
    strength: 1,
    agility: 6,
    wisdom: 2,
    magic: 1,
  },
  knight: {
    weapon: "knife",
    upgradedWeapon: "longsword",
    armor: "partial_plate",
    upgradedArmor: "full_plate",
    strength: 6,
    agility: 2,
    wisdom: 1,
    magic: 1,
  },
  mage: {
    weapon: "staff",
    upgradedWeapon: "staff",
    armor: "cloak",
    upgradedArmor: "silver_armor",
    strength: 0,
    agility: 1,
    wisdom: 3,
    magic: 6,
  },
  brigadier: {
    weapon: "bronze_mace",
    upgradedWeapon: "hammer",
    armor: "brigadier_armor",
    upgradedArmor: "silver_armor",
    strength: 3,
    agility: 1,
    wisdom: 6,
    magic: 1,
  },
};
