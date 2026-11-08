import { getTranslations } from "next-intl/server";
import { ContributeForm } from "@/components/contribute/ContributeForm";
import { BottomNav } from "@/components/navigation/BottomNav";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { SAMPLE_QUOTES } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import { PlusCircle, Sparkles, Quote as QuoteIcon } from "lucide-react";

export default async function ContributePage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const t = await getTranslations();

  let quotes = SAMPLE_QUOTES;
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = createClient();
      const { data } = await supabase
        .from("quotes")
        .select("*")
        .eq("active", true);
      if (data && data.length > 0) quotes = data as any;
    }
  } catch {
    // Fallback
  }

  // Display first quote or random
  const featuredQuote = quotes[0] || SAMPLE_QUOTES[0];

  const initialType = (searchParams.action === "removal_request"
    ? "removal_request"
    : searchParams.type || "place") as string;
  const targetId = (searchParams.correction_for || searchParams.person_id || "") as string;

  return (
    <div className="min-h-screen bg-sahn-bg pb-24">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <PlusCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground leading-none">
                {t("contribute.title")}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[210px]">
                {t("contribute.subtitle")}
              </p>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 flex flex-col gap-4">
        {/* Sanctuary Wisdom Quote Banner */}
        <div className="bg-white rounded-[14px] border border-border p-4 shadow-sm relative overflow-hidden">
          <QuoteIcon className="absolute -bottom-2 -right-2 w-16 h-16 text-primary/5 pointer-events-none" />
          <p
            className="font-arabic text-base text-foreground leading-relaxed text-center"
            dir="rtl"
          >
            {featuredQuote.arabic}
          </p>
          <p className="font-serif text-xs text-muted-foreground text-center mt-2 italic">
            "{featuredQuote.english}"
          </p>
          <span className="block text-[10px] text-primary font-mono text-center mt-1">
            — {featuredQuote.source}
          </span>
        </div>

        {/* Contribution Submission Tabs Form */}
        <ContributeForm initialType={initialType} targetId={targetId} />
      </main>

      <BottomNav />
    </div>
  );
}
