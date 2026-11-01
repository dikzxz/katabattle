"use client";

import { useMemo, useState } from "react";
import { Tile } from "@/components/Tile";
import { generateRound } from "@/lib/grid";

export default function DebugPage() {
  const [seed, setSeed] = useState("katabattle-demo");
  const [showPlacements, setShowPlacements] = useState(false);
  const round = useMemo(() => generateRound(seed), [seed]);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-7 px-5 py-10">
      <header>
        <h1 className="text-4xl font-bold">Debug ronde</h1>
        <p className="mt-2 text-lg">Tema: <strong>{round.theme}</strong></p>
      </header>

      <label className="flex flex-wrap items-center gap-3 font-semibold">
        Seed
        <input
          className="min-h-12 min-w-64 rounded-xl border-[3px] border-navy bg-white px-4 outline-none focus:ring-4 focus:ring-blue/30"
          value={seed}
          onChange={(event) => setSeed(event.target.value)}
          aria-label="Seed ronde"
        />
      </label>

      <section aria-label="Grid ronde" className="grid w-fit grid-cols-9 gap-1 rounded-[22px] border-[3px] border-navy bg-white p-2 shadow-[0_6px_0_#1b2a4a]">
        {round.grid.flatMap((row, rowIndex) => row.map((letter, colIndex) => {
          const placementColor = showPlacements
            ? Object.entries(round.placements).find(([, cells]) => cells.some((cell) => cell.row === rowIndex && cell.col === colIndex))?.[0]
            : undefined;
          return (
            <div key={`${rowIndex}-${colIndex}`} title={placementColor ? `${placementColor} · (${rowIndex}, ${colIndex})` : `(${rowIndex}, ${colIndex})`}>
              <Tile letter={letter} variant={placementColor ? "found-mint" : "normal"} />
            </div>
          );
        }))}
      </section>

      <button
        type="button"
        className="w-fit rounded-[18px] border-[3px] border-navy bg-yellow px-5 py-3 font-bold shadow-[0_4px_0_#c49c22] active:translate-y-1 active:shadow-none"
        onClick={() => setShowPlacements((visible) => !visible)}
      >
        {showPlacements ? "Sembunyikan penempatan" : "Tampilkan penempatan"}
      </button>

      <section className="rounded-[24px] border-[3px] border-navy bg-white p-5 shadow-[0_6px_0_#1b2a4a]">
        <h2 className="mb-3 text-2xl font-bold">Kata ({round.words.length})</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {round.words.map((word) => {
            const start = round.placements[word][0];
            return <li key={word} className="rounded-xl border-2 border-slate-200 px-3 py-2 font-semibold">{word} <span className="text-navy/60">— mulai ({start.row}, {start.col})</span></li>;
          })}
        </ul>
      </section>
    </main>
  );
}
