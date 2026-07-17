import Link from "next/link";
import { ArrowRight } from "lucide-react";

type EliteCtaButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function EliteCtaButton({
  href,
  children,
  className = "",
}: EliteCtaButtonProps) {
  return (
    <Link
      href={href}
      className={[
        "group relative inline-flex h-[54px] w-full items-center justify-center overflow-hidden rounded-full px-8 text-sm font-medium text-white outline-none transition-all duration-300",
        "hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(47,102,80,0.75)]",
        "focus-visible:ring-2 focus-visible:ring-[#79a98e] focus-visible:ring-offset-2",
        "sm:w-auto",
        className,
      ].join(" ")}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full p-px">
        <span className="elite-beam absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#79a98e_360deg)]" />

        <span className="absolute inset-px rounded-full bg-[#080a09]" />
      </span>

      <span className="absolute inset-[2px] overflow-hidden rounded-full bg-[#0b0e0c]">
        <span className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(47,102,80,0.28),transparent_70%)]" />

        <span className="elite-lines absolute inset-0 opacity-[0.08] mix-blend-plus-lighter" />

        <span className="pointer-events-none absolute bottom-[-45%] left-1/2 h-24 w-2/3 -translate-x-1/2 rounded-full bg-[#79a98e]/25 blur-2xl transition-all duration-500 group-hover:bg-[#79a98e]/45" />

        <span className="pointer-events-none absolute left-[18%] top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-white/75 to-transparent" />
      </span>

      <span className="relative z-10 font-semibold uppercase tracking-[0.045em] text-white/90 transition-colors group-hover:text-white">
        {children}
      </span>

      <ArrowRight
        size={16}
        className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  );
}
