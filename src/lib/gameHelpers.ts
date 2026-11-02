import type { Cell } from "@/lib/grid";
import { createSeededRandom } from "@/lib/random";

export const WORD_COLORS = ["yellow", "coral", "mint", "sky", "lavender", "peach", "pink"] as const;
export type WordColor = (typeof WORD_COLORS)[number];

export function colorForClaim(claimIndex: number): WordColor {
  return WORD_COLORS[((claimIndex % WORD_COLORS.length) + WORD_COLORS.length) % WORD_COLORS.length];
}

export function getBotDelay(seed: string, turn: number): number {
  const random = createSeededRandom(`${seed}:bot-delay:${turn}`);
  return 9_000 + Math.floor(random() * 15_001);
}

export function isCellInCells(cells: Cell[], target: Cell): boolean {
  return cells.some((cell) => cell.row === target.row && cell.col === target.col);
}
