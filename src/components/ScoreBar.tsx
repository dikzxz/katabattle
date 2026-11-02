"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { TARGET_SCORE } from "@/lib/config";

type ScorePlayer = { id: string; nickname: string; avatarId: string; score: number };

export function ScoreBar({ players, solo, startedAt, floatingPoint, opponentToast }: {
  players: ScorePlayer[];
  solo: boolean;
  startedAt: number | null;
  floatingPoint: number;
  opponentToast: string | null;
}) {
  const [local, opponent] = players;
  const total = Math.max(1, local.score + (solo ? 0 : opponent?.score ?? 0));
  const blueWidth = solo ? `${Math.min(100, (local.score / 9) * 100)}%` : `${total === 1 ? 50 : (local.score / total) * 100}%`;
  return (
    <div className="relative mx-auto w-full max-w-5xl px-2">
      <div className="flex items-center justify-center gap-2 sm:justify-start sm:gap-3">
        <div className="flex min-w-0 items-center gap-2 rounded-[18px] border-[3px] border-navy bg-blue px-2 py-2 text-white shadow-[0_4px_0_#1b2a4a] sm:px-4">
          <Avatar avatarId={local.avatarId} size={38} />
          <div className="min-w-0"><p className="text-xs font-bold sm:text-base">KAMU</p><p className="text-xs font-bold sm:text-sm">{local.score} kata</p></div>
        </div>

        <div className="relative z-10 shrink-0 rounded-[16px] border-[3px] border-navy bg-yellow px-3 py-2 text-center shadow-[0_4px_0_#1b2a4a] sm:min-w-40 sm:px-5">
          {solo ? <><p className="text-lg font-bold sm:text-2xl">{local.score}/9</p><p className="text-[10px] font-bold sm:text-xs">Kata ditemukan</p></> : <><p className="text-xl font-bold sm:text-3xl">{local.score} - {opponent?.score ?? 0}</p><p className="text-[10px] font-bold sm:text-xs">Duluan sampai {TARGET_SCORE}</p></>}
        </div>

        {solo ? (
          <TimerPill startedAt={startedAt} />
        ) : opponent && (
          <div className="flex min-w-0 items-center gap-2 rounded-[18px] border-[3px] border-navy bg-coral px-2 py-2 text-white shadow-[0_4px_0_#1b2a4a] sm:ml-0 sm:px-4">
            <div className="min-w-0 text-right"><p className="max-w-24 truncate text-xs font-bold sm:text-base">{opponent.nickname}</p><p className="text-xs font-bold sm:text-sm">{opponent.score} kata</p></div>
            <Avatar avatarId={opponent.avatarId} size={38} />
          </div>
        )}
      </div>
      {!solo && <div className="mt-3 flex h-2 overflow-hidden rounded-full border-2 border-navy bg-coral"><div className="bg-blue transition-[width] duration-500" style={{ width: blueWidth }} /></div>}

      <AnimatePresence>
        {floatingPoint > 0 && <motion.div key={floatingPoint} initial={{ opacity: 0, y: 12, scale: 0.7 }} animate={{ opacity: 1, y: -25, scale: 1 }} exit={{ opacity: 0 }} className="absolute left-1/3 top-0 rounded-full border-2 border-navy bg-yellow px-3 py-1 font-bold">+1</motion.div>}
        {opponentToast && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 whitespace-nowrap rounded-full border-[3px] border-navy bg-coral px-4 py-1 text-sm font-bold text-white">{opponentToast}</motion.div>}
      </AnimatePresence>
    </div>
  );
}

function TimerPill({ startedAt }: { startedAt: number | null }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const update = () => setElapsed(startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0);
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, [startedAt]);
  return <div className="shrink-0 rounded-full border-[3px] border-navy bg-yellow px-3 py-2 text-xs font-bold sm:text-base">{String(Math.floor(elapsed / 60)).padStart(2, "0")}:{String(elapsed % 60).padStart(2, "0")}</div>;
}
