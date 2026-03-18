export type Token = {
  raw: string;
  norm: string;
  kind: "word" | "number";
};

export type Analysis = {
  tokens: Token[];
  freq: Record<string, number>;
  top: Array<{ token: string; score: number; count: number }>;
  fingerprint: string;
};

function fnv1a32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function base36(n: number): string {
  return n.toString(36).padStart(7, "0");
}

export function tokenize(input: string): Token[] {
  const cleaned = input
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s._-]/gu, " ")
    .trim();

  if (!cleaned) return [];

  return cleaned.split(/\s+/g).map((raw) => {
    const isNum = /^[+-]?\d+(\.\d+)?$/.test(raw);
    const norm = isNum ? raw.replace(/^\+/, "") : raw.toLowerCase();
    return { raw, norm, kind: isNum ? "number" : "word" };
  });
}

export function analyze(input: string, limit = 8): Analysis {
  const tokens = tokenize(input);
  const freqMap = new Map<string, number>();

  for (const t of tokens) {
    freqMap.set(t.norm, (freqMap.get(t.norm) ?? 0) + 1);
  }

  const top = [...freqMap.entries()]
    .map(([token, count]) => {
      const hash = fnv1a32(token);
      // Deterministic but non-linear score to make merges “interesting”.
      const score = (hash % 97) + count * 13 + (token.length % 5) * 9;
      return { token, score, count };
    })
    .sort((a, b) => b.score - a.score || b.count - a.count || a.token.localeCompare(b.token))
    .slice(0, limit);

  const fingerprint = base36(
    fnv1a32(top.map((t) => `${t.token}:${t.count}`).join("|") + `#${tokens.length}`)
  );

  const freq: Record<string, number> = {};
  for (const [k, v] of freqMap.entries()) freq[k] = v;

  return { tokens, freq, top, fingerprint };
}
