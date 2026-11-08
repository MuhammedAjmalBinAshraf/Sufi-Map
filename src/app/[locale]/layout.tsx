import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Amiri } from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#FAF9F4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const titles: Record<string, string> = {
    en: "Sufi Map — Sacred Sanctuaries & Living Gatherings",
    ml: "സൂഫി മാപ്പ് — പവിത്ര മഖാമുകളും ആത്മീയ സംഗമങ്ങളും",
    ar: "خريطة الصوفية — المقامات والزوايا والمجالس الروحية المباركة",
  };

  const descriptions: Record<string, string> = {
    en: "A calm, minimal guide mapping Sufi dargahs, maqams, zawiyas, and living gatherings in West Malappuram, Kerala.",
    ml: "പശ്ചിമ മലപ്പുറത്തിന്റെ ആത്മീയ പൈതൃകങ്ങളിലേക്കും മഖാമുകളിലേക്കുമുള്ള ശാന്തമായ വഴികാട്ടി.",
    ar: "دليل مبارك وهادئ لتوثيق المقامات الشريفة والزوايا ومجالس الذكر العامة في غرب ملابورام، كيرلا.",
  };

  const title = titles[locale] || titles.en;
  const description = descriptions[locale] || descriptions.en;

  return {
    title,
    description,
    applicationName: "Sufi Map",
    manifest: "/manifest.json",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: "/en",
        ml: "/ml",
        ar: "/ar",
      },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: locale === "ar" ? "ar_AR" : locale === "ml" ? "ml_IN" : "en_US",
      siteName: "Sufi Map",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages({ locale });
  const isRTL = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRTL ? "rtl" : "ltr"}
      className={`${inter.variable} ${playfair.variable} ${amiri.variable}`}
    >
      <body className="min-h-screen bg-sahn-bg text-sahn-ink font-sans antialiased selection:bg-sahn-green/15 selection:text-sahn-green">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen relative pb-16">
            {children}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
