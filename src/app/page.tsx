import { Button } from "@/components/Button";
import { ScorePill } from "@/components/ScorePill";
import { Tile } from "@/components/Tile";
import { GRID_SIZE, TARGET_SCORE, WORD_COUNT } from "@/lib/config";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-10 px-5 py-12 sm:px-8">
      <header className="text-center">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-navy/70">Pratinjau komponen</p>
        <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Kata<span className="text-blue">Battle</span></h1>
        <p className="mt-3 text-lg text-navy/75">Cari kata, adu cepat, jadi juara!</p>
      </header>

      <section className="w-full rounded-[28px] border-[3px] border-navy bg-white p-6 shadow-[0_7px_0_#1b2a4a] sm:p-9">
        <h2 className="mb-5 text-2xl font-bold">Tombol</h2>
        <div className="flex flex-wrap gap-4">
          <Button>MAIN 1v1</Button>
          <Button variant="yellow">MAIN LAGI</Button>
          <Button variant="coral">BATALKAN</Button>
        </div>

        <h2 className="mb-5 mt-10 text-2xl font-bold">Tile huruf</h2>
        <div className="flex flex-wrap gap-3">
          <Tile letter="A" />
          <Tile letter="K" variant="selected" />
          <Tile letter="T" variant="found-mint" />
          <Tile letter="O" variant="found-coral" />
          <Tile letter="B" variant="found-blue" />
        </div>

        <h2 className="mb-5 mt-10 text-2xl font-bold">Skor pertandingan</h2>
        <div className="flex flex-wrap gap-4">
          <ScorePill label="KAMU" score={2} />
          <ScorePill label="LAWAN" score={1} variant="coral" />
        </div>
      </section>

      <aside className="rounded-full border-2 border-navy/20 bg-white/50 px-6 py-3 text-center font-semibold text-navy/80">
        Grid {GRID_SIZE} × {GRID_SIZE} · Target {TARGET_SCORE} poin · {WORD_COUNT} kata per ronde
      </aside>
    </main>
  );
}
