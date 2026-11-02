import { themes, type Theme } from "@/data/themes";
import { ALLOWED_DIRECTIONS, GRID_SIZE, WORD_COUNT } from "@/lib/config";
import { createSeededRandom, pickFillerLetter } from "@/lib/random";

export type Cell = { row: number; col: number };
export type Placement = Cell[];
export type Round = {
  seed: string;
  theme: string;
  words: string[];
  grid: string[][];
  placements: Record<string, Placement>;
};

const DIRECTIONS: Cell[] = ALLOWED_DIRECTIONS.map(({ row, col }) => ({ row, col }));
const MAX_ATTEMPTS = 500;

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function conflicts(candidate: string, selected: string[]): boolean {
  const reverse = (word: string) => [...word].reverse().join("");
  return selected.some((word) => candidate.includes(word) || word.includes(candidate)
    || candidate.includes(reverse(word)) || word.includes(reverse(candidate)));
}

function chooseWords(theme: Theme, random: () => number): string[] | null {
  const chosen: string[] = [];
  for (const word of shuffled(theme.words, random)) {
    if (!conflicts(word, chosen)) chosen.push(word);
    if (chosen.length === WORD_COUNT) return shuffled(chosen, random);
  }
  return null;
}

function tryPlaceWords(words: string[], random: () => number): { grid: (string | null)[][]; placements: Record<string, Placement> } | null {
  const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  const placements: Record<string, Placement> = {};
  const orderedWords = [...words].sort((left, right) => right.length - left.length || (left < right ? -1 : left > right ? 1 : 0));

  for (const word of orderedWords) {
    let placed = false;
    const candidates: { cells: Cell[]; direction: Cell }[] = [];

    for (let row = 0; row < GRID_SIZE; row += 1) {
      for (let col = 0; col < GRID_SIZE; col += 1) {
        for (const direction of DIRECTIONS) {
          const endRow = row + direction.row * (word.length - 1);
          const endCol = col + direction.col * (word.length - 1);
          if (endRow < 0 || endRow >= GRID_SIZE || endCol < 0 || endCol >= GRID_SIZE) continue;
          candidates.push({
            direction,
            cells: Array.from({ length: word.length }, (_, index) => ({
              row: row + direction.row * index,
              col: col + direction.col * index,
            })),
          });
        }
      }
    }

    for (const candidate of shuffled(candidates, random)) {
      const fits = candidate.cells.every((cell, index) => {
        const existing = grid[cell.row][cell.col];
        return existing === null || existing === word[index];
      });
      if (!fits) continue;

      candidate.cells.forEach((cell, index) => { grid[cell.row][cell.col] = word[index]; });
      placements[word] = candidate.cells;
      placed = true;
      break;
    }
    if (!placed) return null;
  }

  return { grid, placements };
}

export function generateRound(seed: string): Round {
  const initialRandom = createSeededRandom(seed);
  const theme = themes[Math.floor(initialRandom() * themes.length)];

  for (let roundAttempt = 0; roundAttempt < 256; roundAttempt += 1) {
    const random = createSeededRandom(`${seed}:round:${roundAttempt}`);
    const words = chooseWords(theme, random);
    if (!words) continue;
    let result: ReturnType<typeof tryPlaceWords> = null;
    for (let attempt = 0; attempt < MAX_ATTEMPTS && !result; attempt += 1) result = tryPlaceWords(words, random);
    if (result) return finishRound(seed, theme.name, words, result.grid, result.placements, random);
  }

  // Guaranteed deterministic fallback: nine short horizontal words and one vertical word in the empty final column.
  const fallbackRandom = createSeededRandom(`${seed}:fallback`);
  const words = chooseWords(theme, fallbackRandom) ?? shuffled(theme.words, fallbackRandom).slice(0, WORD_COUNT);
  const grid: (string | null)[][] = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
  const placements: Record<string, Placement> = {};
  words.slice(0, GRID_SIZE).forEach((word, row) => {
    const cells = Array.from({ length: word.length }, (_, col) => ({ row, col }));
    cells.forEach((cell, index) => { grid[cell.row][cell.col] = word[index]; });
    placements[word] = cells;
  });
  const lastWord = words[GRID_SIZE];
  const lastCells = Array.from({ length: lastWord.length }, (_, row) => ({ row, col: GRID_SIZE - 1 }));
  lastCells.forEach((cell, index) => { grid[cell.row][cell.col] = lastWord[index]; });
  placements[lastWord] = lastCells;
  return finishRound(seed, theme.name, words, grid, placements, fallbackRandom);
}

function finishRound(seed: string, theme: string, words: string[], draft: (string | null)[][], placements: Record<string, Placement>, random: () => number): Round {
  const grid = draft.map((row) => row.map((letter) => letter ?? pickFillerLetter(random)));
  return { seed, theme, words, grid, placements };
}
