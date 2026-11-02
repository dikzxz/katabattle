type TileVariant = "normal" | "selected" | "found-blue" | "found-sky" | "found-yellow" | "found-mint" | "found-coral" | "found-lavender" | "found-peach" | "found-pink";

const variants: Record<TileVariant, string> = {
  normal: "bg-white text-navy shadow-[0_5px_0_#cbd5e1]",
  selected: "bg-yellow text-navy shadow-[0_5px_0_#c49c22]",
  "found-blue": "bg-blue text-white shadow-[0_5px_0_#2456ad]",
  "found-sky": "bg-sky text-navy shadow-[0_5px_0_#47a7d1]",
  "found-yellow": "bg-yellow text-navy shadow-[0_5px_0_#c49c22]",
  "found-mint": "bg-mint text-navy shadow-[0_5px_0_#15945d]",
  "found-coral": "bg-coral text-white shadow-[0_5px_0_#c3443c]",
  "found-lavender": "bg-[#b9a1f4] text-navy shadow-[0_5px_0_#8265c2]",
  "found-peach": "bg-[#ffd7a8] text-navy shadow-[0_5px_0_#c89862]",
  "found-pink": "bg-[#f4a8d3] text-navy shadow-[0_5px_0_#bd6697]",
};

export function Tile({ letter, variant = "normal", className = "" }: { letter: string; variant?: TileVariant; className?: string }) {
  return (
    <div aria-label={`Huruf ${letter}`} className={`grid size-16 place-items-center rounded-[16px] border-[3px] border-navy text-2xl font-bold ${variants[variant]} ${className}`}>
      {letter}
    </div>
  );
}
