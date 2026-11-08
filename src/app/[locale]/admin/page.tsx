import { getTranslations } from "next-intl/server";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { BottomNav } from "@/components/navigation/BottomNav";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { SAMPLE_QUOTES } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import { ShieldCheck } from "lucide-react";

export default async function AdminPage() {
  const t = await getTranslations("admin");

  let quotes = SAMPLE_QUOTES;
  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = createClient();
      const { data } = await supabase.from("quotes").select("*");
      if (data && data.length > 0) quotes = data as any;
    }
  } catch {
    // Fallback
  }

  return (
    <div className="min-h-screen bg-sahn-bg pb-24">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <ShieldCheck className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground leading-none">
                {t("title")}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[210px]">
                {t("subtitle")}
              </p>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 flex flex-col gap-4">
        <AdminDashboard initialQuotes={quotes} />
      </main>

      <BottomNav />
    </div>
  );
}
