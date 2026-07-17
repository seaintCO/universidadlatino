import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "emerald" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[#1f211f] text-white hover:bg-[#30332f] border border-[#1f211f]",
  secondary:
    "bg-white text-[#1f211f] hover:bg-[#f3f1eb] border border-[#ddd9d0]",
  emerald: "bg-[#2f6650] text-white hover:bg-[#254f3f] border border-[#2f6650]",
  ghost:
    "bg-transparent text-[#4f534e] hover:bg-[#efede7] border border-transparent",
};

export function Button({
  className,
  variant = "primary",
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
