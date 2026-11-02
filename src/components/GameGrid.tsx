"use client";

import { motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState, type PointerEvent } from "react";
import { Tile } from "@/components/Tile";
import type { Cell, Round } from "@/lib/grid";
import { colorForClaim, isCellInCells, type WordColor } from "@/lib/gameHelpers";
import { checkSelection, snapToLine } from "@/lib/validate";
import { playSound, unlockAudio } from "@/lib/sound";
import { useGameStore } from "@/store/gameStore";

const variantByColor: Record<WordColor, "found-yellow" | "found-coral" | "found-mint" | "found-sky" | "found-lavender" | "found-peach" | "found-pink"> = {
  yellow: "found-yellow", coral: "found-coral", mint: "found-mint", sky: "found-sky", lavender: "found-lavender", peach: "found-peach", pink: "found-pink",
};
const lineColor: Record<WordColor, string> = { yellow: "#FFD84D", coral: "#FF6B5B", mint: "#4ADE9E", sky: "#7DD8FF", lavender: "#B9A1F4", peach: "#FFD7A8", pink: "#F4A8D3" };

export function GameGrid({ round, playerId, disabled, hintCell, onFound }: {
  round: Round;
  playerId: string;
  disabled: boolean;
  hintCell: Cell | null;
  onFound?: (word: string, playerId: string) => void;
}) {
  const claims = useGameStore((state) => state.claims);
  const claimWord = useGameStore((state) => state.claimWord);
  const [selection, setSelection] = useState<Cell[]>([]);
  const [shake, setShake] = useState(false);
  const pointerId = useRef<number | null>(null);
  const foundCells = useMemo(() => {
    const map = new Map<string, { color: WordColor; pressed: boolean }>();
    Object.entries(claims).forEach(([word], index) => {
      const color = colorForClaim(index);
      round.placements[word]?.forEach((cell) => map.set(`${cell.row},${cell.col}`, { color, pressed: true }));
    });
    return map;
  }, [claims, round.placements]);

  const findCell = useCallback((target: EventTarget | null): Cell | null => {
    if (!(target instanceof Element)) return null;
    const tile = target.closest<HTMLElement>("[data-cell]");
    if (!tile) return null;
    const row = Number(tile.dataset.row);
    const col = Number(tile.dataset.col);
    return Number.isInteger(row) && Number.isInteger(col) ? { row, col } : null;
  }, []);

  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const cell = findCell(event.target);
    if (!cell) return;
    void unlockAudio();
    playSound("tick", 0);
    event.currentTarget.setPointerCapture(event.pointerId);
    pointerId.current = event.pointerId;
    setSelection([cell]);
  };

  const pointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId || selection.length === 0) return;
    const cell = findCell(document.elementFromPoint(event.clientX, event.clientY));
    if (cell) {
      const next = snapToLine(selection[0], cell);
      if (next.length > selection.length) playSound("tick", next.length - 1);
      setSelection(next);
    }
  };

  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== event.pointerId) return;
    pointerId.current = null;
    const cell = findCell(document.elementFromPoint(event.clientX, event.clientY));
    const finalSelection = cell && selection.length ? snapToLine(selection[0], cell) : selection;
    const match = checkSelection(round, finalSelection);
    if (match && !claims[match.word]) {
      playSound("correct");
      claimWord(playerId, match.word);
      onFound?.(match.word, playerId);
    } else if (finalSelection.length > 1) {
      playSound("wrong");
      setShake(true);
      window.setTimeout(() => setShake(false), 320);
    }
    setSelection([]);
  };

  return (
    <motion.div
      animate={shake ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.3 }}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onPointerCancel={() => { pointerId.current = null; setSelection([]); }}
      className="grid w-full grid-cols-9 gap-[3px] rounded-[24px] border-[4px] border-navy bg-white p-2 shadow-[0_7px_0_#1b2a4a] [touch-action:none] select-none sm:gap-1 sm:p-3"
    >
      {round.grid.flatMap((row, rowIndex) => row.map((letter, colIndex) => {
        const cell = { row: rowIndex, col: colIndex };
        const key = `${rowIndex},${colIndex}`;
        const found = foundCells.get(key);
        const selected = isCellInCells(selection, cell);
        const isHint = hintCell?.row === rowIndex && hintCell.col === colIndex;
        return (
          <div
            key={key}
            data-cell
            data-row={rowIndex}
            data-col={colIndex}
            className="relative aspect-square min-w-0"
          >
            <Tile
              letter={letter}
              variant={selected ? "selected" : found ? variantByColor[found.color] : "normal"}
              className={`!h-full !w-full !rounded-[9px] border-2 text-[clamp(0.8rem,4vw,1.55rem)] shadow-[0_3px_0_#aab6c5] sm:!rounded-[12px] sm:border-[3px] ${found ? "translate-y-[2px] !shadow-none" : ""} ${isHint ? "animate-pulse ring-4 ring-yellow" : ""}`}
            />
            {selected && <span className="pointer-events-none absolute inset-[2px] rounded-[8px] border-[2px] border-white shadow-[0_0_0_2px_#1b2a4a]" />}
          </div>
        );
      }))}
      <span className="sr-only">Warna sorotan: {Object.keys(lineColor).length}</span>
    </motion.div>
  );
}
