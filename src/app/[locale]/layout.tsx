import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Sufi Map — Sanctuary & Sacred Presence",
  description:
    "A calm, minimal guide mapping Sufi dargahs, maqams, zawiyas, and living gatherings in West Malappuram, Kerala.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

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
