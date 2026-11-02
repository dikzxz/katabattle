"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const avatars = {
  cat: { letter: "C", color: "#FFD84D" },
  dog: { letter: "A", color: "#FFD7A8" },
  panda: { letter: "P", color: "#4ADE9E" },
  fox: { letter: "F", color: "#FF6B5B" },
  bunny: { letter: "B", color: "#F4A8D3" },
  bear: { letter: "B", color: "#7DD8FF" },
  penguin: { letter: "P", color: "#B9A1F4" },
  frog: { letter: "F", color: "#73E3A4" },
} as const;

export type AvatarId = keyof typeof avatars;

export function Avatar({ avatarId, size = 48, className = "" }: { avatarId: string; size?: number; className?: string }) {
  const avatar = avatars[avatarId as AvatarId] ?? { letter: "?", color: "#CBD5E1" };
  const [hasImage, setHasImage] = useState(false);
  useEffect(() => {
    let active = true;
    const image = new window.Image();
    image.onload = () => { if (active) setHasImage(true); };
    image.onerror = () => { if (active) setHasImage(false); };
    image.src = `/avatars/${avatarId}.png`;
    return () => { active = false; };
  }, [avatarId]);
  return (
    <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-navy font-bold text-navy ${className}`} style={{ width: size, height: size, backgroundColor: avatar.color }}>
      <span aria-hidden className="text-[1.2em]">{avatar.letter}</span>
      {hasImage && <Image src={`/avatars/${avatarId}.png`} alt="" fill sizes={`${size}px`} className="object-cover" />}
    </div>
  );
}

export function AvatarBadge({ avatarId, size = 34, ring = "blue" }: { avatarId: string; size?: number; ring?: "blue" | "coral" }) {
  return <Avatar avatarId={avatarId} size={size} className={`ring-[3px] ${ring === "blue" ? "ring-blue" : "ring-coral"}`} />;
}
