import { create } from "zustand";
import { generateRound, type Round } from "@/lib/grid";
import { TARGET_SCORE, WORD_COUNT } from "@/lib/config";

export type Player = {
  id: string;
  nickname: string;
  avatarId: string;
  score: number;
};

type GameState = {
  round: Round | null;
  players: Player[];
  claims: Record<string, string>;
  winnerId: string | null;
  startedAt: number | null;
  mode: "solo" | "versus";
  startRound: (seed: string, players: Omit<Player, "score">[], mode?: "solo" | "versus") => void;
  claimWord: (playerId: string, word: string) => void;
};

export const useGameStore = create<GameState>((set) => ({
  round: null,
  players: [],
  claims: {},
  winnerId: null,
  startedAt: null,
  mode: "versus",
  startRound: (seed, players, mode = players.length < 2 ? "solo" : "versus") => {
    set({
      round: generateRound(seed),
      players: players.map((player) => ({ ...player, score: 0 })),
      claims: {},
      winnerId: null,
      startedAt: Date.now(),
      mode,
    });
  },
  claimWord: (playerId, word) => set((state) => {
    if (!state.round || state.winnerId || state.claims[word] || !state.round.words.includes(word)) return state;
    const playerIndex = state.players.findIndex((player) => player.id === playerId);
    if (playerIndex < 0) return state;

    const players = state.players.map((player) => player.id === playerId
      ? { ...player, score: player.score + 1 }
      : player);
    const player = players[playerIndex];
    return {
      claims: { ...state.claims, [word]: playerId },
      players,
      winnerId: state.mode === "versus"
        ? (player.score >= TARGET_SCORE ? playerId : null)
        : (Object.keys(state.claims).length + 1 >= WORD_COUNT ? playerId : null),
    };
  }),
}));
