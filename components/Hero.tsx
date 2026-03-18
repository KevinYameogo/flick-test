import React from "react";

type Highlight = {
  token: string;
  score: number;
};

function normalize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .split(/[\s-]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function stableScore(token: string): number {
  // Simple deterministic hash -> score in [1..100]
  let h = 2166136261;
  for (let i = 0; i < token.length; i++) {
    h ^= token.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 100 + 1;
}

function buildHighlights(sentence: string): Highlight[] {
  const counts = new Map<string, number>();
  for (const t of normalize(sentence)) {
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([token, count]) => ({
      token,
      score: stableScore(token) + count * 7,
    }))
    .sort((a, b) => b.score - a.score || a.token.localeCompare(b.token))
    .slice(0, 6);
}

const Hero = () => {
  const highlights = buildHighlights(
    "Ship fast, resolve issues, and intentionally create merge conflicts."
  );

  return (
    <section>
      <h2>Hero</h2>
      <p>Generated highlights (deterministic):</p>
      <ol>
        {highlights.map((h) => (
          <li key={h.token}>
            <strong>{h.token}</strong> — {h.score}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Hero;
