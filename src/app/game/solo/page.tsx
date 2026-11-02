import { GameScreen } from "@/components/GameScreen";
import { Suspense } from "react";

async function SoloGameContent({ searchParams }: { searchParams: Promise<{ seed?: string }> }) {
  const { seed } = await searchParams;
  return <GameScreen key={seed ?? "solo-random"} solo initialSeed={seed ?? "solo-random-seed"} />;
}

export default function SoloGamePage(props: { searchParams: Promise<{ seed?: string }> }) {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-sky font-bold text-navy">Menyiapkan permainan...</main>}><SoloGameContent {...props} /></Suspense>;
}
