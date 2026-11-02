"use client";

import { motion } from "framer-motion";
import { AvatarBadge } from "@/components/Avatar";
import { colorForClaim, type WordColor } from "@/lib/gameHelpers";
import type { Round } from "@/lib/grid";

const rowColors: Record<WordColor, string> = {
  yellow: "bg-yellow text-navy", coral: "bg-coral text-white", mint: "bg-mint text-navy",
  sky: "bg-sky text-navy", lavender: "bg-[#b9a1f4] text-navy", peach: "bg-[#ffd7a8] text-navy", pink: "bg-[#f4a8d3] text-navy",
};

export function WordsToFind({ round, claims, players }: {
  round: Round;
  claims: Record<string, string>;
  players: { id: string; avatarId: string }[];
}) {
  const claimedWords = round.words.filter((word) => claims[word]);
  return (
    <section className="rounded-[24px] border-[4px] border-navy bg-white p-4 shadow-[0_6px_0_#1b2a4a] sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2 text-xl font-bold sm:text-2xl">
        <h2>Words to find</h2>
        <span className="text-blue">{claimedWords.length}/{round.words.length}</span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-1">
        {round.words.map((word, index) => {
          const playerId = claims[word];
          const player = players.find((item) => item.id === playerId);
          const color = colorForClaim(Object.keys(claims).indexOf(word));
          return (
            <motion.li
              key={word}
              layout
              initial={false}
              animate={playerId ? { scale: [0.96, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, delay: playerId ? index * 0.01 : 0 }}
              className={`flex min-h-10 items-center justify-between gap-2 rounded-[14px] border-2 px-3 py-1.5 text-sm font-bold sm:text-base ${playerId ? `${rowColors[color]} border-navy line-through` : "border-slate-300 bg-white text-navy"}`}
            >
              <span>{word}</span>
              {playerId && player && <AvatarBadge avatarId={player.avatarId} size={25} ring={playerId === "local" ? "blue" : "coral"} />}
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
