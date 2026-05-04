import { useState, type DragEvent } from "react";
import { characterBuilds } from "@/data/character-builds";
import { useToastStore } from "@/components/ui/toast";
import type { BuildName } from "@/types/builds";

type ItemType = "weapon" | "armor";
type SlotId = "weapon-1" | "weapon-2" | "armor-1" | "armor-2";

type InventoryItem = {
  id: string;
  name: string;
  label: string;
  type: ItemType;
};

type Slot = { id: SlotId; type: ItemType };

const SLOTS: Slot[] = [
  { id: "weapon-1", type: "weapon" },
  { id: "weapon-2", type: "weapon" },
  { id: "armor-1", type: "armor" },
  { id: "armor-2", type: "armor" },
];

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

type EquippedSlots = Record<SlotId, InventoryItem | null>;

const EMPTY_SLOTS: EquippedSlots = {
  "weapon-1": null,
  "weapon-2": null,
  "armor-1": null,
  "armor-2": null,
};

export default function InventoryPage() {
  const addToast = useToastStore((s) => s.addToast);
  const [build, setBuild] = useState<BuildName>("thief");
  const [equipped, setEquipped] = useState<EquippedSlots>(EMPTY_SLOTS);
  const [dragOver, setDragOver] = useState<SlotId | null>(null);

  const allItems = getItems(build);
  const equippedIds = new Set(
    Object.values(equipped).filter(Boolean).map((item) => item!.id)
  );
  const bag = allItems.filter((item) => !equippedIds.has(item.id));

  const handleBuildChange = (next: BuildName) => {
    setBuild(next);
    setEquipped(EMPTY_SLOTS);
  };

  const onDragStart = (e: DragEvent<HTMLDivElement>, item: InventoryItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>, slotId: SlotId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(slotId);
  };

  const onDragLeave = () => setDragOver(null);

  const onDrop = (e: DragEvent<HTMLDivElement>, slotId: SlotId) => {
    e.preventDefault();
    setDragOver(null);
    const item: InventoryItem = JSON.parse(e.dataTransfer.getData("application/json"));
    const slot = SLOTS.find((s) => s.id === slotId)!;

    if (item.type !== slot.type) {
      addToast(`A ${item.type} cannot be equipped in the ${slot.type} slot.`, "error");
      return;
    }

    if (equipped[slotId] !== null) {
      addToast(`This slot is already occupied.`, "error");
      return;
    }

    setEquipped((prev) => ({ ...prev, [slotId]: item }));
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
            <option key={b} value={b}>
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
            className="min-h-[220px] rounded-lg border border-dashed border-muted-foreground/40 p-3 flex flex-col gap-2"
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
            {SLOTS.map((slot) => {
              const equippedItem = equipped[slot.id];
              const isOver = dragOver === slot.id;
              return (
                <div
                  key={slot.id}
                  data-testid={`inventory-slot-${slot.id}`}
                  onDragOver={(e) => onDragOver(e, slot.id)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, slot.id)}
                  className={`min-h-[56px] rounded-lg border-2 p-3 flex items-center gap-3 transition-colors ${
                    isOver
                      ? "border-blue-400 bg-blue-500/10"
                      : "border-dashed border-muted-foreground/40"
                  }`}
                >
                  <span className="text-lg">{slotIcons[slot.type]}</span>
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
                      {slot.type} slot — drop here
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
