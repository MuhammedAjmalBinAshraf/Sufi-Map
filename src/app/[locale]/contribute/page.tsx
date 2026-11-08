import { getTranslations } from "next-intl/server";
import { ContributeForm } from "@/components/contribute/ContributeForm";
import { RotatingQuote } from "@/components/contribute/RotatingQuote";
import { BadgeProgressCard } from "@/components/badges/BadgeProgressCard";
import { BottomNav } from "@/components/navigation/BottomNav";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { SAMPLE_QUOTES } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import { PlusCircle } from "lucide-react";

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
        {/* Rotating Wisdom & Kindness Quotation Card */}
        <RotatingQuote quotes={quotes} />

        {/* Badges of Stewardship Progress Card */}
        <BadgeProgressCard
          stats={{
            approvedEntriesCount: 1,
            sourcedEntriesCount: 1,
            verifiedOthersCount: 0,
            isNazir: false,
          }}
        />

        {/* Contribution Submission Tabs Form */}
        <ContributeForm initialType={initialType} targetId={targetId} />
      </main>

      <BottomNav />
    </div>
  );
}
