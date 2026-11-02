import { GameScreen } from "@/components/GameScreen";
import { Suspense } from "react";

async function VersusDemoContent({ searchParams }: { searchParams: Promise<{ seed?: string }> }) {
  const { seed } = await searchParams;
  return <GameScreen key={seed ?? "versus-random"} solo={false} initialSeed={seed ?? "versus-random-seed"} />;
}

export default function VersusDemoPage(props: { searchParams: Promise<{ seed?: string }> }) {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center bg-sky font-bold text-navy">Menyiapkan permainan...</main>}><VersusDemoContent {...props} /></Suspense>;
}
