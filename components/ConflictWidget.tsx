import React from "react";
import { runEngine } from "../lib/conflictEngine";

type Props = {
  text: string;
  title?: string;
};

export default function ConflictWidget({ text, title = "Secondary Widget" }: Props) {
  const res = React.useMemo(() => runEngine(text, 6), [text]);

  return (
    <section style={{ border: "1px dashed #999", borderRadius: 12, padding: 12 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <code style={{ opacity: 0.8 }}>dg:{res.digest}</code>
      </header>

      <p style={{ marginTop: 8, marginBottom: 8, opacity: 0.85 }}>
        Total tokens: <strong>{res.total}</strong>
      </p>

      <ul style={{ marginTop: 0 }}>
        {res.items.map((i) => (
          <li key={i.key}>
            <strong>{i.key}</strong> — count {i.count}, entropy {i.entropy.toFixed(3)}
          </li>
        ))}
      </ul>
    </section>
  );
}
