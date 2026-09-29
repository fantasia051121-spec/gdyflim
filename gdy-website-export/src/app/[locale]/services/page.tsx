import { setRequestLocale } from "next-intl/server";
import ServicesSection from "@/components/ServicesSection";
import CtaSection from "@/components/CtaSection";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-16">
      <ServicesSection />
      <CtaSection />
    </div>
  );
}
