import { useState, type DragEvent } from "react";
import { characterBuilds } from "@/data/character-builds";
import { useToastStore } from "@/components/ui/toast";
import type { BuildName } from "@/types/builds";

type ItemType = "weapon" | "armor";

type InventoryItem = {
  id: string;
  name: string;
  label: string;
  type: ItemType;
};

function toLabel(name: string): string {
  return name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getItems(build: BuildName): InventoryItem[] {
  const b = characterBuilds[build];
  return [
    { id: "weapon", name: b.weapon, label: toLabel(b.weapon), type: "weapon" },
    { id: "upgradedWeapon", name: b.upgradedWeapon, label: toLabel(b.upgradedWeapon), type: "weapon" },
    { id: "armor", name: b.armor, label: toLabel(b.armor), type: "armor" },
    { id: "upgradedArmor", name: b.upgradedArmor, label: toLabel(b.upgradedArmor), type: "armor" },
  ];
}

const BUILD_NAMES = Object.keys(characterBuilds) as BuildName[];

const slotIcons: Record<ItemType, string> = {
  weapon: "⚔️",
  armor: "🛡️",
};

type EquippedItems = { weapon: InventoryItem | null; armor: InventoryItem | null };

export default function InventoryPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [build, setBuild] = useState<BuildName>("thief");
  const [equipped, setEquipped] = useState<EquippedItems>({ weapon: null, armor: null });
  const [dragOver, setDragOver] = useState<ItemType | null>(null);

  const allItems = getItems(build);
  const equippedIds = new Set(
    [equipped.weapon?.id, equipped.armor?.id].filter(Boolean) as string[]
  );
  const bag = allItems.filter((item) => !equippedIds.has(item.id));

  const handleBuildChange = (next: BuildName) => {
    setBuild(next);
    setEquipped({ weapon: null, armor: null });
  };

  const onDragStart = (e: DragEvent<HTMLDivElement>, item: InventoryItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>, slotType: ItemType) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(slotType);
  };

  const onDragLeave = () => setDragOver(null);

  const onDrop = (e: DragEvent<HTMLDivElement>, slotType: ItemType) => {
    e.preventDefault();
    setDragOver(null);
    const item: InventoryItem = JSON.parse(e.dataTransfer.getData("application/json"));

    if (item.type !== slotType) {
      addToast(
        `A ${item.type} cannot be equipped in the ${slotType} slot.`,
        "error"
      );
      return;
    }

    setEquipped((prev) => ({ ...prev, [slotType]: item }));
    addToast(`${item.label} equipped!`);
  };

  return (
    <div data-testid="inventory-page" className="w-full max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <p className="text-sm text-muted-foreground">
          Drag items from your bag into the equipment slots.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="inventory-build-select" className="text-sm font-medium">
          Build
        </label>
        <select
          id="inventory-build-select"
          data-testid="inventory-build-select"
          value={build}
          onChange={(e) => handleBuildChange(e.target.value as BuildName)}
          className="rounded border border-input bg-background px-3 py-1.5 text-sm capitalize"
        >
          {BUILD_NAMES.map((b) => (
            <option key={b} value={b} className="capitalize">
              {b.charAt(0).toUpperCase() + b.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bag */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Bag</h2>
          <div
            data-testid="inventory-bag"
            className="min-h-[180px] rounded-lg border border-dashed border-muted-foreground/40 p-3 flex flex-col gap-2"
          >
            {bag.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">All items equipped</p>
            ) : (
              bag.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  data-testid="inventory-item"
                  data-item-name={item.name}
                  data-item-type={item.type}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-muted cursor-grab active:cursor-grabbing select-none hover:bg-muted/80 transition-colors"
                >
                  <span>{slotIcons[item.type]}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">{item.type}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Equipment slots */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Equipment</h2>
          <div className="flex flex-col gap-3">
            {(["weapon", "armor"] as ItemType[]).map((slotType) => {
              const equippedItem = equipped[slotType];
              const isOver = dragOver === slotType;
              return (
                <div
                  key={slotType}
                  data-testid={`inventory-slot-${slotType}`}
                  onDragOver={(e) => onDragOver(e, slotType)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, slotType)}
                  className={`min-h-[64px] rounded-lg border-2 p-3 flex items-center gap-3 transition-colors ${
                    isOver
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-dashed border-muted-foreground/40"
                  }`}
                >
                  <span className="text-xl">{slotIcons[slotType]}</span>
                  {equippedItem ? (
                    <div
                      data-testid="equipped-item"
                      data-item-name={equippedItem.name}
                      data-item-type={equippedItem.type}
                      className="text-sm font-medium"
                    >
                      {equippedItem.label}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic capitalize">
                      {slotType} slot — drop here
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
