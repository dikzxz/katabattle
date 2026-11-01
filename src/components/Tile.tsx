type TileVariant = "normal" | "selected" | "found-blue" | "found-yellow" | "found-mint" | "found-coral";

const variants: Record<TileVariant, string> = {
  normal: "bg-white text-navy",
  selected: "bg-yellow text-navy",
  "found-blue": "bg-blue text-white",
  "found-yellow": "bg-yellow text-navy",
  "found-mint": "bg-mint text-navy",
  "found-coral": "bg-coral text-white",
};

export function Tile({ letter, variant = "normal" }: { letter: string; variant?: TileVariant }) {
  return (
    <div aria-label={`Huruf ${letter}`} className={`grid size-16 place-items-center rounded-[16px] border-[3px] border-navy text-2xl font-bold shadow-[0_5px_0_#9ba9b8] ${variants[variant]}`}>
      {letter}
    </div>
  );
}
