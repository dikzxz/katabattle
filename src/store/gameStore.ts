import { create } from "zustand";
import { generateRound, type Round } from "@/lib/grid";
import { TARGET_SCORE } from "@/lib/config";

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
  startRound: (seed: string, players: Omit<Player, "score">[]) => void;
  claimWord: (playerId: string, word: string) => void;
};

export const useGameStore = create<GameState>((set) => ({
  round: null,
  players: [],
  claims: {},
  winnerId: null,
  startedAt: null,
  startRound: (seed, players) => {
    set({
      round: generateRound(seed),
      players: players.map((player) => ({ ...player, score: 0 })),
      claims: {},
      winnerId: null,
      startedAt: Date.now(),
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
      winnerId: player.score >= TARGET_SCORE ? playerId : null,
    };
  }),
}));
