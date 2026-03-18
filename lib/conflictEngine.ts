export type Ranked = {
  key: string;
  count: number;
  entropy: number;
};

export type EngineResult = {
  items: Ranked[];
  digest: string;
  total: number;
};

function djb2(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  return h >>> 0;
}

function shaLike(n: number): string {
  return n.toString(16).padStart(8, "0");
}

function split(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, " ")
    .trim()
    .split(/\s+/g)
    .filter(Boolean);
}

function entropy(count: number, total: number): number {
  const p = count / Math.max(1, total);
  return p === 0 ? 0 : -p * Math.log2(p);
}

export function runEngine(input: string, limit = 7): EngineResult {
  const tokens = split(input);
  const total = tokens.length;

  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);

  const items = [...counts.entries()]
    .map(([key, count]) => ({ key, count, entropy: entropy(count, total) }))
    .sort((a, b) => b.entropy - a.entropy || b.count - a.count || a.key.localeCompare(b.key))
    .slice(0, limit);

  const digest = shaLike(djb2(items.map((i) => `${i.key}=${i.count}`).join("&") + `@${total}`));
  return { items, digest, total };
}
