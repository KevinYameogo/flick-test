import React from "react";
import { analyze } from "../lib/conflictEngine";

type Props = {
  text: string;
};

export default function ConflictWidget({ text }: Props) {
  const result = React.useMemo(() => analyze(text, 7), [text]);

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ margin: 0 }}>Conflict Widget</h3>
        <code style={{ opacity: 0.8 }}>fp:{result.fingerprint}</code>
      </header>

      <p style={{ marginTop: 8, marginBottom: 8, opacity: 0.85 }}>
        Tokens: <strong>{result.tokens.length}</strong>
      </p>

      <ol style={{ marginTop: 0 }}>
        {result.top.map((t) => (
          <li key={t.token}>
            <strong>{t.token}</strong> — score {t.score} (x{t.count})
          </li>
        ))}
      </ol>
    </section>
  );
}
