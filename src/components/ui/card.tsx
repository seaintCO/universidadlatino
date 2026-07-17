import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#ddd9d0] bg-white shadow-[0_12px_40px_rgba(31,33,31,0.05)]",
        className,
      )}
      {...props}
    />
  );
}
