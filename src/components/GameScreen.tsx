"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/Button";
import { GameGrid } from "@/components/GameGrid";
import { Logo } from "@/components/Logo";
import { ScoreBar } from "@/components/ScoreBar";
import { WordsToFind } from "@/components/WordsToFind";
import { GRID_SIZE, TARGET_SCORE, WORD_COUNT } from "@/lib/config";
import { colorForClaim, getBotDelay } from "@/lib/gameHelpers";
import type { Cell } from "@/lib/grid";
import { generateRound } from "@/lib/grid";
import { newSeed, createSeededRandom } from "@/lib/random";
import { isMuted, playSound, setMuted, unlockAudio } from "@/lib/sound";
import { useGameStore } from "@/store/gameStore";

const LOCAL_PLAYER = { id: "local", nickname: "Kamu", avatarId: "cat" };
const BOT_PLAYER = { id: "bot", nickname: "SitiMaster", avatarId: "fox" };

export function GameScreen({ solo, initialSeed, avoidRecentThemes = false }: { solo: boolean; initialSeed: string; avoidRecentThemes?: boolean }) {
  const startRound = useGameStore((state) => state.startRound);
  const round = useGameStore((state) => state.round);
  const players = useGameStore((state) => state.players);
  const myFoundWords = useGameStore((state) => state.myFoundWords);
  const myCount = useGameStore((state) => state.myCount);
  const opponentCount = useGameStore((state) => state.opponentCount);
  const winner = useGameStore((state) => state.winner);
  const startedAt = useGameStore((state) => state.startedAt);
  const opponentScored = useGameStore((state) => state.opponentScored);
  const [seed, setSeed] = useState(initialSeed);
  const [hintCount, setHintCount] = useState(1);
  const [hintCell, setHintCell] = useState<Cell | null>(null);
  const [floatingPoint, setFloatingPoint] = useState(0);
  const [opponentToast, setOpponentToast] = useState<string | null>(null);
  const [muted, setMutedState] = useState(true);
  const lastWinner = useRef<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const begin = useCallback((requestedSeed: string, avoidRecent = false) => {
    let nextSeed = requestedSeed;
    if (solo && avoidRecent) {
      let recent: string[] = [];
      try { recent = JSON.parse(window.localStorage.getItem("katabattle-recent-themes") ?? "[]") as string[]; } catch { recent = []; }
      for (let attempt = 0; attempt < 100 && recent.includes(generateRound(nextSeed).theme); attempt += 1) nextSeed = newSeed();
      const selectedTheme = generateRound(nextSeed).theme;
      try { window.localStorage.setItem("katabattle-recent-themes", JSON.stringify([selectedTheme, ...recent.filter((theme) => theme !== selectedTheme)].slice(0, 2))); } catch { /* Storage may be disabled in private contexts. */ }
    }
    setSeed(nextSeed);
    startRound(nextSeed, solo ? [LOCAL_PLAYER] : [LOCAL_PLAYER, BOT_PLAYER], solo ? "solo" : "versus");
    setHintCount(1);
    setHintCell(null);
    setFloatingPoint(0);
    setOpponentToast(null);
  }, [solo, startRound]);

  useEffect(() => {
    const timer = window.setTimeout(() => begin(initialSeed, avoidRecentThemes), 0);
    return () => window.clearTimeout(timer);
  }, [begin, initialSeed, avoidRecentThemes]);

  useEffect(() => {
    const timer = window.setTimeout(() => setMutedState(isMuted()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const done = winner !== null;

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
        if (current.winner || current.opponentCount >= TARGET_SCORE) return;
        playSound("opponent");
        opponentScored();
        setOpponentToast(`${BOT_PLAYER.nickname} +1 kata!`);
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setOpponentToast(null), 2400);
        turn += 1;
        if (!useGameStore.getState().winner) schedule();
      }, delay);
    };
    schedule();
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [solo, round, done, seed, opponentScored]);

  const handleFound = () => {
    setFloatingPoint((count) => count + 1);
    window.setTimeout(() => setFloatingPoint(0), 1000);
  };

  const useHint = () => {
    if (!round || hintCount <= 0 || done) return;
    const remaining = round.words.filter((word) => !myFoundWords.some((found) => found.word === word));
    if (!remaining.length) return;
    const random = createSeededRandom(`${seed}:hint:${hintCount}`);
    const word = remaining[Math.floor(random() * remaining.length)];
    playSound("hint");
    setHintCell(round.placements[word][0]);
    setHintCount((count) => count - 1);
    window.setTimeout(() => setHintCell(null), 2000);
  };

  useEffect(() => {
    if (!winner || lastWinner.current === winner) return;
    lastWinner.current = winner;
    playSound(winner === "me" ? "win" : "lose");
  }, [winner]);

  const toggleMute = async () => {
    await unlockAudio();
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  if (!round) return null;
  return (
    <main className="min-h-screen bg-sky px-3 pb-8 pt-3 text-navy sm:px-6 sm:pt-5">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 sm:gap-6">
        <div className="relative flex w-full justify-center">
          <Logo size="md" />
          <button
            type="button"
            aria-label={muted ? "Aktifkan suara" : "Bisukan suara"}
            onPointerDown={() => { void unlockAudio(); }}
            onClick={toggleMute}
            className="absolute right-1 top-0 grid size-11 place-items-center rounded-full border-[3px] border-navy bg-yellow text-xl shadow-[0_4px_0_#c49c22] active:translate-y-1 active:shadow-none sm:right-0"
          >{muted ? "🔇" : "🔊"}</button>
        </div>
        <ScoreBar players={players} solo={solo} startedAt={startedAt} myCount={myCount} opponentCount={opponentCount} floatingPoint={floatingPoint} opponentToast={opponentToast} />
        <h1 className="mt-1 text-center text-3xl font-bold text-white drop-shadow-[0_3px_0_#1b2a4a] sm:mt-2 sm:text-4xl">{round.theme}</h1>

        <div className="grid w-full max-w-5xl grid-cols-1 items-start gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.8fr)] md:gap-8">
          <div className="flex min-w-0 flex-col gap-5">
            <GameGrid round={round} disabled={done} hintCell={hintCell} onFound={handleFound} />
            <div className="flex justify-center md:justify-end">
              <Button variant="yellow" disabled={hintCount <= 0 || done} onClick={useHint} className="min-h-12 px-5 text-base">
                💡 Petunjuk <span className="ml-2 grid size-7 place-items-center rounded-full border-2 border-navy bg-coral text-white">{hintCount}</span>
              </Button>
            </div>
          </div>
          <WordsToFind round={round} myFoundWords={myFoundWords} />
        </div>
      </div>

      {done && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-navy/55 p-5 backdrop-blur-sm">
          <section className="w-full max-w-md rounded-[30px] border-[5px] border-navy bg-white p-7 text-center shadow-[0_10px_0_#1b2a4a]">
            <h2 className="text-5xl font-bold">{solo ? "SELESAI!" : winner === "me" ? "MENANG!" : "KALAH"}</h2>
            <p className="mt-4 text-xl font-bold">{solo ? `${myCount}/${WORD_COUNT} kata ditemukan` : `Skor akhir ${myCount} - ${opponentCount}`}</p>
            {!solo && <div className="mt-4 flex justify-center"><Avatar avatarId={winner === "me" ? LOCAL_PLAYER.avatarId : BOT_PLAYER.avatarId} size={76} /></div>}
            <Button variant="yellow" className="mt-7 w-full" onClick={() => begin(newSeed(), solo)}>Main Lagi</Button>
          </section>
        </div>
      )}
      <span className="sr-only">Ukuran grid {GRID_SIZE} dan target skor {TARGET_SCORE}. Warna kata berikutnya {colorForClaim(myFoundWords.length)}.</span>
    </main>
  );
}
