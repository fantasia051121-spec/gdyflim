import Reveal from "./ui/Reveal";
import { industryImages } from "@/lib/site";

export default function CaseCard({
  title,
  desc,
  sector,
  index,
}: {
  title: string;
  desc: string;
  sector: string;
  index: number;
}) {
  const img = industryImages[index];

  if (!img) {
    return (
      <Reveal delay={index * 0.05}>
        <div className="glass glass-hover flex h-full flex-col rounded-2xl p-6">
          <span className="mb-3 inline-block w-fit rounded-full bg-ink/10 px-3 py-1 text-xs font-medium text-ink/70">
            {sector}
          </span>
          <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
          <p className="text-sm leading-relaxed text-muted">{desc}</p>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal delay={index * 0.05}>
      <div className="glass glass-hover group overflow-hidden rounded-2xl">
        <div className="relative h-44 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
          <span className="absolute bottom-3 start-4 rounded-full glass px-3 py-1 text-xs font-medium text-white/90">
            {sector}
          </span>
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
          <p className="text-sm leading-relaxed text-muted">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}
