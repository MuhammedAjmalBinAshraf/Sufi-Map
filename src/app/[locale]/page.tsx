import { getTranslations } from "next-intl/server";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Navigation,
  Bookmark,
  Edit3,
  Plus,
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations();

  const filterChips = [
    { id: "all", label: t("filters.all"), active: true },
    { id: "maqam", label: t("filters.maqam"), active: false },
    { id: "dargah", label: t("filters.dargah"), active: false },
    { id: "zawiya", label: t("filters.zawiya"), active: false },
    { id: "gathering", label: t("filters.gathering"), active: false },
  ];

  return (
    <main className="relative flex-1 flex flex-col min-h-screen bg-sahn-bg overflow-hidden select-none">
      {/* Top Floating App Bar & Search Zone */}
      <header className="sticky top-0 z-40 px-4 pt-3 pb-2 bg-sahn-bg/90 backdrop-blur-md border-b border-border/60">
        <div className="max-w-md mx-auto flex flex-col gap-2.5">
          {/* Header Row: Sanctuary Title & Locale Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Compass className="w-4 h-4 text-primary animate-[spin_60s_linear_infinite]" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold tracking-tight text-foreground leading-none">
                  {t("common.title")}
                </h1>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-normal truncate max-w-[210px]">
                  {t("common.tagline")}
                </p>
              </div>
            </div>
            <LocaleSwitcher />
          </div>

          {/* Search Input Bar (Shadcn Input inside thumb zone) */}
          <div className="relative">
            <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              readOnly
              placeholder={t("common.searchPlaceholder")}
              className="w-full h-11 pl-10 pr-4 rtl:pl-4 rtl:pr-10 bg-white border-border rounded-[14px] text-sm placeholder:text-muted-foreground/80 shadow-sm focus-visible:ring-primary"
            />
          </div>

          {/* Filter Chips Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {filterChips.map((chip) => (
              <Badge
                key={chip.id}
                variant={chip.active ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  chip.active
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-white text-muted-foreground border-border hover:text-foreground"
                }`}
              >
                {chip.label}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Main Sanctuary Map Canvas Placeholder */}
      <section className="relative flex-1 bg-[hsl(var(--map-background))] min-h-[360px] flex items-center justify-center overflow-hidden">
        {/* Subtle sanctuary courtyard grid pattern */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#1F5C3A 0.75px, transparent 0.75px), radial-gradient(#1F5C3A 0.75px, #EEF0E6 0.75px)`,
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0, 14px 14px",
          }}
        />

        {/* Mock Sanctuary Pin: Mampuram Maqam (West Malappuram) */}
        <div className="relative z-10 flex flex-col items-center group cursor-pointer transition-transform hover:scale-105">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center border-2 border-white">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="w-3 h-3 bg-primary rotate-45 mx-auto -mt-1.5 rounded-sm" />
          </div>
          <div className="mt-1.5 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-border text-[11px] font-medium text-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Mampuram Maqam
          </div>
        </div>

        {/* Compass & Geographic Watermark */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border text-[10px] text-muted-foreground flex items-center gap-1.5 shadow-sm">
          <span className="font-serif">West Malappuram, Kerala</span>
        </div>

        {/* Floating Action Button (+) bottom-right in Sanctuary Green */}
        <Button
          size="icon"
          aria-label="Add a Sacred Place"
          className="absolute bottom-4 right-4 z-20 w-13 h-13 p-0 rounded-full bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(31,92,58,0.35)] hover:bg-primary/95 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-[2.25]" />
        </Button>
      </section>

      {/* Sahn Bottom Sheet: Place Summary Card in Thumb Zone */}
      <Card className="relative z-30 rounded-t-[20px] rounded-b-none shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t border-x-0 border-b-0 border-border max-w-md mx-auto w-full bg-white">
        {/* Grab Handle */}
        <div className="w-10 h-1 rounded-full bg-border mx-auto mt-3 mb-1" />

        <CardContent className="p-4 pt-2">
          {/* Trilingual Title Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-transparent text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full"
                >
                  Maqam
                </Badge>
                <span className="text-[11px] text-muted-foreground">Tirurangadi, Malappuram</span>
              </div>
              <h2 className="font-serif text-xl font-semibold text-foreground mt-1.5 leading-snug">
                Sayyid Alawi Thangal Maqam
              </h2>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground mt-0.5">
                <span className="font-sans">സയ്യിദ് അലവി തങ്ങൾ മഖാം</span>
                <span className="text-border">•</span>
                <span className="font-arabic" dir="rtl">
                  مقام السيد علوي بن سهل
                </span>
              </div>
            </div>
          </div>

          {/* Short History & Visiting Etiquette Preview */}
          <p className="text-xs text-muted-foreground mt-2.5 line-clamp-2 leading-relaxed">
            Historical 18th-century sanctuary and resting place of Sayyid Alawi Mouladdawilah,
            a beacon of spiritual guidance, communal harmony, and knowledge in Malabar.
          </p>

          {/* Source Citation (Strict Attribution Rule) */}
          <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Source: Tuhfat al-Nafis & Local Waqf Archives (Verified)</span>
          </div>

          {/* Primary Action Buttons in Thumb Zone */}
          <div className="grid grid-cols-12 gap-2 mt-4">
            {/* Primary Directions CTA in Sanctuary Green */}
            <Button
              className="col-span-6 h-11 bg-primary text-primary-foreground rounded-[14px] font-medium text-xs flex items-center justify-center gap-2 hover:bg-primary/90 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
              <span>{t("common.directions")}</span>
            </Button>

            {/* Ghost Save CTA */}
            <Button
              variant="outline"
              className="col-span-3 h-11 bg-white border-border text-foreground rounded-[14px] font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-sahn-bg"
            >
              <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
              <span>{t("common.save")}</span>
            </Button>

            {/* Ghost Suggest Edit CTA */}
            <Button
              variant="outline"
              className="col-span-3 h-11 bg-white border-border text-muted-foreground rounded-[14px] font-medium text-xs flex items-center justify-center gap-1 hover:text-foreground hover:bg-sahn-bg"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="truncate">{t("common.suggestEdit")}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Fixed Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
