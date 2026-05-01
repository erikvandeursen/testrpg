import type { VercelRequest, VercelResponse } from "@vercel/node";
import { characterBuilds } from "../src/data/character-builds";

type CustomBuild = {
  name: string;
  strength: number;
  agility: number;
  wisdom: number;
  magic: number;
};

// In-memory store — resets on cold start, intentional for the test casus
const customBuilds: Record<string, CustomBuild> = {};

const BUILT_IN_NAMES = new Set(Object.keys(characterBuilds));

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method === "GET") {
    return handleGet(req, res);
  }

  if (req.method === "POST") {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: `Method '${req.method}' not allowed` });
}

function handleGet(req: VercelRequest, res: VercelResponse) {
  const buildParam = req.query.build;
  const buildName = Array.isArray(buildParam) ? buildParam[0] : buildParam;

  if (buildName) {
    const build =
      characterBuilds[buildName as keyof typeof characterBuilds] ??
      customBuilds[buildName];

    if (!build) {
      return res.status(404).json({ error: `Build '${buildName}' not found` });
    }

    return res.status(200).json({ [buildName]: build });
  }

  return res.status(200).json({ ...characterBuilds, ...customBuilds });
}

function handlePost(req: VercelRequest, res: VercelResponse) {
  const body = req.body as { build?: Partial<CustomBuild> } | undefined;

  if (!body?.build) {
    return res.status(400).json({ error: "Request body must contain a 'build' object" });
  }

  const { name, strength, agility, wisdom, magic } = body.build;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "'name' must be a non-empty string" });
  }

  const statFields: Array<[string, unknown]> = [
    ["strength", strength],
    ["agility", agility],
    ["wisdom", wisdom],
    ["magic", magic],
  ];

  for (const [key, val] of statFields) {
    if (typeof val !== "number" || !Number.isInteger(val)) {
      return res.status(400).json({ error: `'${key}' must be an integer` });
    }
    if (val < 0) {
      return res.status(400).json({ error: `'${key}' cannot be negative` });
    }
    if (val > 10) {
      return res.status(400).json({ error: `'${key}' cannot exceed 10` });
    }
  }

  const stats = [strength as number, agility as number, wisdom as number, magic as number];
  const sum = stats.reduce((a, b) => a + b, 0);
  if (sum > 10) {
    return res.status(400).json({ error: "The sum of all stats cannot exceed 10" });
  }

  const normalizedName = name.trim().toLowerCase();
  if (BUILT_IN_NAMES.has(normalizedName) || customBuilds[normalizedName]) {
    return res.status(409).json({ error: `Build name '${normalizedName}' already exists` });
  }

  const newBuild: CustomBuild = {
    name: normalizedName,
    strength: strength as number,
    agility: agility as number,
    wisdom: wisdom as number,
    magic: magic as number,
  };
  customBuilds[normalizedName] = newBuild;

  return res.status(201).json({ build: newBuild });
}
