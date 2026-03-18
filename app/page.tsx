import ConflictWidget from "../components/ConflictWidget";

export default function Home() {
  return (
    <>
      <ul>
        <li>Changes</li>
      </ul>
      <ConflictWidget
        title="Conflict Widget (secondary-b)"
        text="Resolve issues quickly; rebase often; then merge branches and handle conflicts gracefully."
      />
    </>
  );
}
