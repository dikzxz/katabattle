export function ScorePill({ label, score, variant = "blue" }: { label: string; score: number; variant?: "blue" | "coral" }) {
  const color = variant === "blue" ? "bg-blue text-white" : "bg-coral text-white";
  return (
    <div className={`flex min-w-40 items-center justify-between gap-4 rounded-full border-[3px] border-navy px-5 py-3 shadow-[0_4px_0_#1b2a4a] ${color}`}>
      <span className="font-bold">{label}</span>
      <span className="text-2xl font-bold tabular-nums">{score}</span>
    </div>
  );
}
