import { getTranslations } from "next-intl/server";
import ServiceCard from "./ServiceCard";
import Reveal from "./ui/Reveal";
import { productImages } from "@/lib/site";

export default async function ServicesSection() {
  const t = await getTranslations("services");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section className="py-16 sm:py-24">
      <div className="container-x">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-ink sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 text-muted">{t("subtitle")}</p>
          </div>
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <ServiceCard
              key={i}
              title={it.title}
              desc={it.desc}
              img={productImages[i]}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
