import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

type PlatformInfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
};

export function PlatformInfoPage({
  eyebrow,
  title,
  description,
  icon: Icon,
  actionLabel = "Abrir Academia",
  actionHref = "/cursos",
}: PlatformInfoPageProps) {
  return (
    <div className="px-4 py-8 md:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl">
        <p className="editorial-label">{eyebrow}</p>

        <div className="mt-4 rounded-3xl border border-[#ddd9d0] bg-white p-7 shadow-[0_12px_40px_rgba(31,33,31,0.05)] md:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3ece7] text-[#2f6650]">
            <Icon size={23} strokeWidth={1.7} />
          </div>

          <h1 className="mt-7 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#686c66] md:text-base">
            {description}
          </p>

          <Link
            href={actionHref}
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#1f211f] px-6 text-sm font-semibold !text-white hover:bg-[#30332f]"
          >
            {actionLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
