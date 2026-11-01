import Image from "next/image";

const widths = {
  sm: 80,
  md: 160,
  lg: 260,
} as const;

export function Logo({ size = "md" }: { size?: keyof typeof widths }) {
  return (
    <Image
      src="/logo.png"
      alt="KataBattle"
      width={widths[size]}
      height={Math.round(widths[size] / 2.65)}
      priority
    />
  );
}
