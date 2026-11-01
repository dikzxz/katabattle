import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "yellow" | "coral";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-blue text-white shadow-[0_5px_0_#2456ad] hover:bg-[#3277e8]",
  yellow: "bg-yellow text-navy shadow-[0_5px_0_#c49c22] hover:bg-[#ffcf32]",
  coral: "bg-coral text-white shadow-[0_5px_0_#c3443c] hover:bg-[#f45f50]",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`inline-flex min-h-14 items-center justify-center rounded-[20px] border-[3px] border-navy px-7 text-lg font-[700] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
