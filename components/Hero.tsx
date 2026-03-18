import React from "react";

type Stat = {
  word: string;
  freq: number;
  weight: number;
};

function words(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/g)
    .filter(Boolean);
}

function weightOf(word: string): number {
  // Different scoring than main: base-36 rolling value -> [0..97]
  let acc = 0;
  for (const ch of word) acc = (acc * 31 + ch.charCodeAt(0)) % 97;
  return acc;
}

function topStats(input: string, limit = 5): Stat[] {
  const freq = new Map<string, number>();
  for (const w of words(input)) freq.set(w, (freq.get(w) ?? 0) + 1);

  return [...freq.entries()]
    .map(([word, f]) => ({ word, freq: f, weight: weightOf(word) + f * 11 }))
    .sort((a, b) => b.weight - a.weight || b.freq - a.freq || a.word.localeCompare(b.word))
    .slice(0, limit);
}

const Hero = () => {
  const stats = topStats("Resolve bugs quickly; then merge and enjoy conflicts.", 6);
  const checksum = stats.reduce((sum, s) => sum + s.weight, 0);

  return (
    <section>
      <h2>Hero</h2>
      <p>
        Secondary branch flavor. Checksum: <strong>{checksum}</strong>
      </p>
      <ul>
        {stats.map((s) => (
          <li key={s.word}>
            {s.word} ({s.freq}) → {s.weight}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Hero;
