import { create } from "zustand";
import { generateRound, type Cell, type Round } from "@/lib/grid";
import { TARGET_SCORE, WORD_COUNT } from "@/lib/config";

export type Player = { id: string; nickname: string; avatarId: string };
export type MyFoundWord = { word: string; cells: Cell[]; colorIndex: number };
export type Winner = "me" | "opponent" | null;

type GameState = {
  round: Round | null;
  players: Player[];
  mode: "solo" | "versus";
  myFoundWords: MyFoundWord[];
  opponentCount: number;
  myCount: number;
  startedAt: number | null;
  finishedAt: number | null;
  opponentFinishedAt: number | null;
  winner: Winner;
  startRound: (seed: string, players: Player[], mode?: "solo" | "versus", startedAt?: number) => void;
  foundWord: (word: string, cells: Cell[], timestamp?: number) => void;
  opponentScored: (timestamp?: number) => void;
};

function resolveWinner(state: Pick<GameState, "mode" | "myCount" | "opponentCount" | "finishedAt" | "opponentFinishedAt">): Winner {
  if (state.mode === "solo") return state.myCount >= WORD_COUNT ? "me" : null;
  const meFinished = state.myCount >= TARGET_SCORE && state.finishedAt !== null;
  const opponentFinished = state.opponentCount >= TARGET_SCORE && state.opponentFinishedAt !== null;
  if (meFinished && opponentFinished) return state.finishedAt! <= state.opponentFinishedAt! ? "me" : "opponent";
  if (meFinished) return "me";
  if (opponentFinished) return "opponent";
  return null;
}

export const useGameStore = create<GameState>((set) => ({
  round: null,
  players: [],
  mode: "versus",
  myFoundWords: [],
  opponentCount: 0,
  myCount: 0,
  startedAt: null,
  finishedAt: null,
  opponentFinishedAt: null,
  winner: null,
  startRound: (seed, players, mode = players.length < 2 ? "solo" : "versus", startedAt = Date.now()) => {
    set({
      round: generateRound(seed), players, mode, myFoundWords: [], opponentCount: 0, myCount: 0,
      startedAt, finishedAt: null, opponentFinishedAt: null, winner: null,
    });
  },
  foundWord: (word, cells, timestamp = Date.now()) => set((state) => {
    if (!state.round || !state.round.words.includes(word) || state.myFoundWords.some((found) => found.word === word)) return state;
    if (state.winner && !(state.mode === "versus" && state.myCount === TARGET_SCORE - 1 && state.finishedAt === null)) return state;
    const myFoundWords = [...state.myFoundWords, { word, cells: cells.map((cell) => ({ ...cell })), colorIndex: state.myFoundWords.length }];
    const myCount = myFoundWords.length;
    const finishedAt = state.mode === "solo"
      ? (myCount >= WORD_COUNT ? timestamp : state.finishedAt)
      : (myCount >= TARGET_SCORE ? timestamp : state.finishedAt);
    const next = { ...state, myFoundWords, myCount, finishedAt };
    return { myFoundWords, myCount, finishedAt, winner: resolveWinner(next) };
  }),
  opponentScored: (timestamp = Date.now()) => set((state) => {
    if (state.mode !== "versus" || state.opponentCount >= TARGET_SCORE) return state;
    if (state.winner && !(state.myCount === TARGET_SCORE && state.finishedAt !== null)) return state;
    const opponentCount = state.opponentCount + 1;
    const opponentFinishedAt = opponentCount >= TARGET_SCORE ? timestamp : state.opponentFinishedAt;
    const next = { ...state, opponentCount, opponentFinishedAt };
    return { opponentCount, opponentFinishedAt, winner: resolveWinner(next) };
  }),
}));
