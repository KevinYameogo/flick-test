import ConflictWidget from "../components/ConflictWidget";

export default function Home() {
  return (
    <>
      <ul>
        <li>Changes</li>
      </ul>
      <ConflictWidget text="Resolve issues, ship code, then intentionally create conflicts across branches." />
    </>
  );
}
