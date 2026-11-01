type TileVariant = "normal" | "selected" | "found-blue" | "found-yellow" | "found-mint" | "found-coral";

const variants: Record<TileVariant, string> = {
  normal: "bg-white text-navy shadow-[0_5px_0_#cbd5e1]",
  selected: "bg-yellow text-navy shadow-[0_5px_0_#c49c22]",
  "found-blue": "bg-blue text-white shadow-[0_5px_0_#2456ad]",
  "found-yellow": "bg-yellow text-navy shadow-[0_5px_0_#c49c22]",
  "found-mint": "bg-mint text-navy shadow-[0_5px_0_#15945d]",
  "found-coral": "bg-coral text-white shadow-[0_5px_0_#c3443c]",
};

export function Tile({ letter, variant = "normal" }: { letter: string; variant?: TileVariant }) {
  return (
    <div aria-label={`Huruf ${letter}`} className={`grid size-16 place-items-center rounded-[16px] border-[3px] border-navy text-2xl font-bold ${variants[variant]}`}>
      {letter}
    </div>
  );
}
