import { beforeEach, describe, expect, it } from "vitest";
import { generateRound, type Cell, type Round } from "@/lib/grid";
import { WORD_COUNT } from "@/lib/config";
import { checkSelection, snapToLine } from "@/lib/validate";
import { useGameStore } from "@/store/gameStore";
import { themes } from "@/data/themes";
import { colorForClaim, getBotDelay } from "@/lib/gameHelpers";
import { createSeededRandom, newSeed, pickFillerLetter } from "@/lib/random";
import { TARGET_SCORE } from "@/lib/config";

describe("generateRound", () => {
  it("keeps every theme word valid and free from contained words", () => {
    for (const theme of themes) {
      expect(theme.words.length).toBeGreaterThanOrEqual(40);
      for (const [index, word] of theme.words.entries()) {
        expect(word).toMatch(/^[A-Z]{4,7}$/);
        for (const other of theme.words.slice(index + 1)) {
          expect(word.includes(other) || other.includes(word)).toBe(false);
        }
      }
    }
  });

  it("produces an identical round for the same seed", () => {
    expect(generateRound("identik-01")).toEqual(generateRound("identik-01"));
  });

  it("generates valid, complete rounds for 300 different seeds", () => {
    for (let seedIndex = 0; seedIndex < 300; seedIndex += 1) {
      const round = generateRound(`batch-seed-${seedIndex}`);
      expect(round.words).toHaveLength(WORD_COUNT);
      expect(round.grid).toHaveLength(9);
      expect(Object.keys(round.placements)).toHaveLength(WORD_COUNT);
      for (const word of round.words) {
        const cells = round.placements[word];
        expect(cells).toHaveLength(word.length);
        expect(cells.map(({ row, col }) => round.grid[row][col]).join("")).toBe(word);
      }
      for (const [wordIndex, word] of round.words.entries()) {
        for (const other of round.words.slice(wordIndex + 1)) {
          const reverse = (value: string) => [...value].reverse().join("");
          expect(word.includes(other) || other.includes(word) || word.includes(reverse(other)) || other.includes(reverse(word))).toBe(false);
        }
      }
    }
  });

  it("makes varied rounds across 100 random seeds", () => {
    const rounds = Array.from({ length: 100 }, () => generateRound(newSeed()));
    expect(new Set(rounds.map((round) => round.theme)).size).toBeGreaterThanOrEqual(8);
    expect(new Set(rounds.map((round) => [...round.words].sort().join(","))).size).toBeGreaterThan(80);
  });

  it("keeps every word unique across all themes", () => {
    const allWords = themes.flatMap((theme) => theme.words);
    expect(new Set(allWords).size).toBe(allWords.length);
    expect(themes.map((theme) => theme.name)).toEqual([
      "Di Rumah", "Hewan", "Makanan", "Sekolah", "Alam", "Pasar", "Transportasi", "Pakaian", "Tubuh", "Pekerjaan",
    ]);
  });

  it("produces different grids for different seeds", () => {
    expect(generateRound("seed-alpha").grid).not.toEqual(generateRound("seed-beta").grid);
  });

  it("places every listed word and always returns WORD_COUNT words", () => {
    const round = generateRound("placement-check");
    expect(round.words).toHaveLength(WORD_COUNT);
    for (const word of round.words) {
      const cells = round.placements[word];
      expect(cells).toHaveLength(word.length);
      expect(cells.map(({ row, col }) => round.grid[row][col]).join("")).toBe(word);
    }
  });

  it("places words only in the allowed reading directions", () => {
    const round = generateRound("reading-directions");
    for (const cells of Object.values(round.placements)) {
      const rowDelta = cells[1].row - cells[0].row;
      const colDelta = cells[1].col - cells[0].col;
      expect([[0, 1], [1, 0], [1, 1], [-1, 1]]).toContainEqual([rowDelta, colDelta]);
    }
  });
});

function roundFor(word: string, cells: Cell[]): Round {
  const grid = Array.from({ length: 9 }, () => Array(9).fill("X"));
  cells.forEach((cell, index) => { grid[cell.row][cell.col] = word[index]; });
  return { seed: "test", theme: "Tes", words: [word], grid, placements: { [word]: cells } };
}

describe("checkSelection", () => {
  it("accepts forward and reversed words", () => {
    const cells = [{ row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }];
    const round = roundFor("KATA", cells);
    expect(checkSelection(round, cells)?.word).toBe("KATA");
    expect(checkSelection(round, [...cells].reverse())?.word).toBe("KATA");
  });

  it.each([
    ["horizontal", [{ row: 4, col: 1 }, { row: 4, col: 2 }, { row: 4, col: 3 }, { row: 4, col: 4 }]],
    ["vertical", [{ row: 1, col: 3 }, { row: 2, col: 3 }, { row: 3, col: 3 }, { row: 4, col: 3 }]],
    ["diagonal", [{ row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 }, { row: 4, col: 4 }]],
  ])("accepts %s words", (_direction, cells) => {
    const typedCells = cells as Cell[];
    expect(checkSelection(roundFor("KATA", typedCells), typedCells)?.word).toBe("KATA");
  });

  it("rejects bent, gapped, repeated and non-word selections", () => {
    const straight = [{ row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }];
    const round = roundFor("KATA", straight);
    expect(checkSelection(round, [{ row: 1, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }])).toBeNull();
    expect(checkSelection(round, [{ row: 2, col: 1 }, { row: 2, col: 3 }, { row: 2, col: 4 }, { row: 2, col: 5 }])).toBeNull();
    expect(checkSelection(round, [{ row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 4 }])).toBeNull();
    expect(checkSelection({ ...round, words: ["LAIN"] }, straight)).toBeNull();
  });

  it("snaps a pointer position to one of eight directions", () => {
    expect(snapToLine({ row: 2, col: 2 }, { row: 4, col: 3 })).toEqual([
      { row: 2, col: 2 }, { row: 3, col: 3 }, { row: 4, col: 4 },
    ]);
  });
});

describe("game store", () => {
  const players = [
      { id: "p1", nickname: "Kamu", avatarId: "cat" },
      { id: "p2", nickname: "Lawan", avatarId: "fox" },
  ];

  beforeEach(() => useGameStore.getState().startRound("store-test", players, "versus", 100));

  it("allows independent finds of the same word and rejects local duplicates", () => {
    const word = useGameStore.getState().round!.words[0];
    const cells = useGameStore.getState().round!.placements[word];
    useGameStore.getState().foundWord(word, cells, 200);
    useGameStore.getState().foundWord(word, cells, 201);
    expect(useGameStore.getState().myCount).toBe(1);
    expect(useGameStore.getState().myFoundWords).toEqual([{ word, cells, colorIndex: 0 }]);
    useGameStore.getState().opponentScored(202);
    expect(useGameStore.getState().opponentCount).toBe(1);
    expect("opponentFoundWords" in useGameStore.getState()).toBe(false);
    expect(typeof useGameStore.getState().opponentCount).toBe("number");
  });

  it("opponent scoring exposes only count and does not end before TARGET_SCORE", () => {
    for (let index = 0; index < TARGET_SCORE - 1; index += 1) useGameStore.getState().opponentScored(200 + index);
    expect(useGameStore.getState().opponentCount).toBe(TARGET_SCORE - 1);
    expect(useGameStore.getState().opponentFinishedAt).toBeNull();
    expect(useGameStore.getState().winner).toBeNull();
  });

  it("ends versus at TARGET_SCORE and uses the earlier finish timestamp", () => {
    const round = useGameStore.getState().round!;
    for (let index = 0; index < TARGET_SCORE - 1; index += 1) {
      const word = round.words[index];
      useGameStore.getState().foundWord(word, round.placements[word], 300 + index);
      useGameStore.getState().opponentScored(300 + index);
    }
    const lastWord = round.words[TARGET_SCORE - 1];
    useGameStore.getState().foundWord(lastWord, round.placements[lastWord], 500);
    expect(useGameStore.getState().winner).toBe("me");
    useGameStore.getState().opponentScored(499);
    expect(useGameStore.getState().opponentCount).toBe(TARGET_SCORE);
    expect(useGameStore.getState().winner).toBe("opponent");
  });

  it("solo ends only after all WORD_COUNT words are found", () => {
    useGameStore.getState().startRound("solo-mode-test", [players[0]], "solo", 100);
    const round = useGameStore.getState().round!;
    for (const word of round.words.slice(0, 9)) useGameStore.getState().foundWord(word, round.placements[word], 500);
    expect(useGameStore.getState().myCount).toBe(9);
    expect(useGameStore.getState().winner).toBeNull();
    const last = round.words[9];
    useGameStore.getState().foundWord(last, round.placements[last], 600);
    expect(useGameStore.getState().winner).toBe("me");
    expect(useGameStore.getState().finishedAt).toBe(600);
  });
});

describe("game helpers", () => {
  it("cycles through found-word colors", () => {
    expect(Array.from({ length: 9 }, (_, index) => colorForClaim(index))).toEqual([
      "yellow", "coral", "mint", "sky", "lavender", "peach", "pink", "yellow", "coral",
    ]);
  });

  it("creates a reproducible bot delay in the expected range", () => {
    expect(getBotDelay("bot-seed", 3)).toBe(getBotDelay("bot-seed", 3));
    expect(getBotDelay("bot-seed", 3)).toBeGreaterThanOrEqual(9_000);
    expect(getBotDelay("bot-seed", 3)).toBeLessThanOrEqual(24_000);
  });
});

describe("weighted filler letters", () => {
  it("uses the seeded generator reproducibly and favors common Indonesian letters", () => {
    const pickMany = (seed: string) => {
      const random = createSeededRandom(seed);
      return Array.from({ length: 10_000 }, () => pickFillerLetter(random));
    };
    const sequence = pickMany("weighted-fill");
    expect(sequence).toEqual(pickMany("weighted-fill"));
    expect(sequence.filter((letter) => "ANIKETRUSML".includes(letter)).length).toBeGreaterThan(sequence.length * 0.55);
    expect(sequence.filter((letter) => "QX".includes(letter)).length).toBeLessThan(sequence.length * 0.01);
  });
});
