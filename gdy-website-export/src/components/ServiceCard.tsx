import Reveal from "./ui/Reveal";

export default function ServiceCard({
  title,
  desc,
  img,
  index,
}: {
  title: string;
  desc: string;
  img?: string;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.05}>
      <div className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-2xl">
        {img && (
          <div className="relative h-44 w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 text-lg font-semibold text-ink">{title}</h3>
          <p className="text-sm leading-relaxed text-muted">{desc}</p>
        </div>
      </div>
    </Reveal>
  );
}
