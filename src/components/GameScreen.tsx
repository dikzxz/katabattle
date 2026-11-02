"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { GameGrid } from "@/components/GameGrid";
import { Logo } from "@/components/Logo";
import { ScoreBar } from "@/components/ScoreBar";
import { WordsToFind } from "@/components/WordsToFind";
import { GRID_SIZE, TARGET_SCORE } from "@/lib/config";
import { colorForClaim, getBotDelay, pickBotWord } from "@/lib/gameHelpers";
import type { Cell } from "@/lib/grid";
import { createSeededRandom } from "@/lib/random";
import { useGameStore } from "@/store/gameStore";

const LOCAL_PLAYER = { id: "local", nickname: "Kamu", avatarId: "cat" };
const BOT_PLAYER = { id: "bot", nickname: "SitiMaster", avatarId: "fox" };

export function GameScreen({ solo, initialSeed }: { solo: boolean; initialSeed: string }) {
  const startRound = useGameStore((state) => state.startRound);
  const round = useGameStore((state) => state.round);
  const players = useGameStore((state) => state.players);
  const claims = useGameStore((state) => state.claims);
  const winnerId = useGameStore((state) => state.winnerId);
  const startedAt = useGameStore((state) => state.startedAt);
  const claimWord = useGameStore((state) => state.claimWord);
  const [seed, setSeed] = useState(initialSeed);
  const [hintCount, setHintCount] = useState(1);
  const [hintCell, setHintCell] = useState<Cell | null>(null);
  const [floatingPoint, setFloatingPoint] = useState(0);
  const [opponentToast, setOpponentToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const newSeed = () => `${Date.now()}-${crypto.randomUUID()}`;
  const begin = useCallback((nextSeed: string) => {
    setSeed(nextSeed);
    startRound(nextSeed, solo ? [LOCAL_PLAYER] : [LOCAL_PLAYER, BOT_PLAYER]);
    setHintCount(1);
    setHintCell(null);
    setFloatingPoint(0);
    setOpponentToast(null);
  }, [solo, startRound]);

  useEffect(() => {
    const timer = window.setTimeout(() => begin(initialSeed.includes("random-seed") ? `${Date.now()}-${crypto.randomUUID()}` : initialSeed), 0);
    return () => window.clearTimeout(timer);
  }, [begin, initialSeed]);

  const foundOrder = useMemo(() => Object.keys(claims), [claims]);
  const done = solo ? foundOrder.length >= 9 : winnerId !== null;

  useEffect(() => {
    if (solo || !round || done) return;
    let cancelled = false;
    let timer = 0;
    let turn = 0;
    const schedule = () => {
      const delay = getBotDelay(seed, turn);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        const current = useGameStore.getState();
        if (current.winnerId || !current.round) return;
        const unclaimed = current.round.words.filter((word) => !current.claims[word]);
        const word = pickBotWord(seed, turn, unclaimed);
        if (word) {
          claimWord(BOT_PLAYER.id, word);
          setOpponentToast(`${BOT_PLAYER.nickname} menemukan ${word}!`);
          if (toastTimer.current) window.clearTimeout(toastTimer.current);
          toastTimer.current = window.setTimeout(() => setOpponentToast(null), 2400);
        }
        turn += 1;
        if (!useGameStore.getState().winnerId) schedule();
      }, delay);
    };
    schedule();
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [solo, round, done, seed, claimWord]);

  const handleFound = (word: string, playerId: string) => {
    if (playerId === LOCAL_PLAYER.id) {
      setFloatingPoint((count) => count + 1);
      window.setTimeout(() => setFloatingPoint(0), 1000);
    } else {
      setOpponentToast(`${BOT_PLAYER.nickname} menemukan ${word}!`);
    }
  };

  const useHint = () => {
    if (!round || hintCount <= 0 || done) return;
    const remaining = round.words.filter((word) => !claims[word]);
    if (!remaining.length) return;
    const random = createSeededRandom(`${seed}:hint:${hintCount}`);
    const word = remaining[Math.floor(random() * remaining.length)];
    setHintCell(round.placements[word][0]);
    setHintCount((count) => count - 1);
    window.setTimeout(() => setHintCell(null), 2000);
  };

  const winner = players.find((player) => player.id === winnerId);
  const localScore = players.find((player) => player.id === "local")?.score ?? 0;
  const botScore = players.find((player) => player.id === "bot")?.score ?? 0;

  if (!round) return null;
  return (
    <main className="min-h-screen bg-sky px-3 pb-8 pt-3 text-navy sm:px-6 sm:pt-5">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 sm:gap-6">
        <Logo size="md" />
        <ScoreBar players={players} solo={solo} startedAt={startedAt} floatingPoint={floatingPoint} opponentToast={opponentToast} />
        <h1 className="mt-1 text-center text-3xl font-bold text-white drop-shadow-[0_3px_0_#1b2a4a] sm:mt-2 sm:text-4xl">{round.theme}</h1>

        <div className="grid w-full max-w-5xl grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)] md:gap-8">
          <div className="flex min-w-0 flex-col gap-5">
            <GameGrid round={round} playerId="local" disabled={done} hintCell={hintCell} onFound={handleFound} />
            <div className="flex justify-center md:justify-end">
              <Button variant="yellow" disabled={hintCount <= 0 || done} onClick={useHint} className="min-h-12 px-5 text-base">
                💡 Petunjuk <span className="ml-2 grid size-7 place-items-center rounded-full border-2 border-navy bg-coral text-white">{hintCount}</span>
              </Button>
            </div>
          </div>
          <WordsToFind round={round} claims={claims} players={players} />
        </div>
      </div>

      {done && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/55 p-5 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-[30px] border-[5px] border-navy bg-white p-7 text-center shadow-[0_10px_0_#1b2a4a]">
            <h2 className="text-5xl font-bold">{solo ? "SELESAI!" : winnerId === "local" ? "MENANG!" : "KALAH"}</h2>
            <p className="mt-4 text-xl font-bold">{solo ? `${foundOrder.length}/9 kata ditemukan` : `Skor akhir ${localScore} - ${botScore}`}</p>
            {!solo && winner && <div className="mt-4 flex justify-center"><Avatar avatarId={winner.avatarId} size={76} /></div>}
            <Button variant="yellow" className="mt-7 w-full" onClick={() => begin(newSeed())}>Main Lagi</Button>
          </section>
        </div>
      )}
      <span className="sr-only">Ukuran grid {GRID_SIZE} dan target skor {TARGET_SCORE}. Warna klaim berikutnya {colorForClaim(foundOrder.length)}.</span>
    </main>
  );
}
