import { beforeEach, describe, expect, it } from "vitest";
import { generateRound, type Cell, type Round } from "@/lib/grid";
import { WORD_COUNT } from "@/lib/config";
import { checkSelection, snapToLine } from "@/lib/validate";
import { useGameStore } from "@/store/gameStore";
import { themes } from "@/data/themes";
import { colorForClaim, getBotDelay, pickBotWord } from "@/lib/gameHelpers";

describe("generateRound", () => {
  it("keeps every theme word valid and free from contained words", () => {
    for (const theme of themes) {
      expect(theme.words.length).toBeGreaterThanOrEqual(14);
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
  beforeEach(() => useGameStore.getState().startRound("store-test", [
    { id: "p1", nickname: "Kamu", avatarId: "cat" },
    { id: "p2", nickname: "Lawan", avatarId: "fox" },
  ]));

  it("ignores duplicate claims and declares the first player at TARGET_SCORE", () => {
    const store = useGameStore.getState();
    const words = store.round!.words;
    for (const word of words.slice(0, 4)) store.claimWord("p1", word);
    store.claimWord("p2", words[0]);
    expect(useGameStore.getState().players.find((player) => player.id === "p1")?.score).toBe(4);
    expect(useGameStore.getState().players.find((player) => player.id === "p2")?.score).toBe(0);
    store.claimWord("p1", words[4]);
    expect(useGameStore.getState().winnerId).toBe("p1");
    store.claimWord("p2", words[5]);
    expect(useGameStore.getState().claims[words[5]]).toBeUndefined();
    expect(useGameStore.getState().players.find((player) => player.id === "p2")?.score).toBe(0);
  });

  it("does not end solo at TARGET_SCORE, then ends when all words are claimed", () => {
    useGameStore.getState().startRound("solo-mode-test", [
      { id: "solo", nickname: "Kamu", avatarId: "cat" },
    ], "solo");
    const words = useGameStore.getState().round!.words;
    for (const word of words.slice(0, 5)) useGameStore.getState().claimWord("solo", word);
    expect(useGameStore.getState().winnerId).toBeNull();
    for (const word of words.slice(5)) useGameStore.getState().claimWord("solo", word);
    expect(useGameStore.getState().winnerId).toBe("solo");
    expect(useGameStore.getState().players[0].score).toBe(9);
  });

  it("still ends versus at TARGET_SCORE", () => {
    useGameStore.getState().startRound("versus-mode-test", [
      { id: "p1", nickname: "Kamu", avatarId: "cat" },
      { id: "p2", nickname: "Lawan", avatarId: "fox" },
    ], "versus");
    const words = useGameStore.getState().round!.words;
    for (const word of words.slice(0, 5)) useGameStore.getState().claimWord("p1", word);
    expect(useGameStore.getState().winnerId).toBe("p1");
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
    expect(getBotDelay("bot-seed", 3)).toBeGreaterThanOrEqual(8_000);
    expect(getBotDelay("bot-seed", 3)).toBeLessThanOrEqual(20_000);
  });

  it("picks a reproducible unclaimed bot word or null when empty", () => {
    expect(pickBotWord("bot-seed", 4, ["KURSI", "GELAS"])).toBe(pickBotWord("bot-seed", 4, ["KURSI", "GELAS"]));
    expect(["KURSI", "GELAS"]).toContain(pickBotWord("bot-seed", 4, ["KURSI", "GELAS"]));
    expect(pickBotWord("bot-seed", 4, [])).toBeNull();
  });
});
