import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, CalendarDays, Navigation, PencilLine } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/lib/i18n";
import { DISTRICTS, type Site } from "@/lib/sites";
import { useSteward } from "@/lib/steward";

import { KindBadge } from "./KindBadge";

export function SiteDetail({ site, onBack }: { site: Site; onBack: () => void }) {
  const { t, pick } = useI18n();
  const { counts, markVisited, toggleSaved } = useSteward();
  const [correcting, setCorrecting] = useState(false);
  const isSaved = counts.saved.includes(site.id);

  useEffect(() => markVisited(site.id), [site.id, markVisited]);

  return (
    <article className="animate-in fade-in-0 slide-in-from-bottom-1 duration-300">
      <div className="mb-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ms-2 text-muted-foreground">
          <ArrowLeft className="rtl:rotate-180" aria-hidden />
          {t("back")}
        </Button>
      </div>

      <KindBadge kind={site.kind} />
      <h2 className="mt-3 text-2xl leading-tight">{pick(site.name)}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("district")}: {pick(DISTRICTS[site.district])}
      </p>

      {site.schedule && (
        <p className="mt-3 flex items-center gap-2 rounded-[14px] bg-accent px-3 py-2 text-sm">
          <CalendarDays className="size-4 text-primary" aria-hidden />
          <span className="text-muted-foreground">{t("when")}:</span> {pick(site.schedule)}
        </p>
      )}

      <p className="mt-4 text-[15px] leading-relaxed">{pick(site.summary)}</p>

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button asChild>
          <a
            href={`https://www.openstreetmap.org/directions?route=%3B${site.lat}%2C${site.lng}`}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation aria-hidden />
            {t("directions")}
          </a>
        </Button>
        <Button variant="outline" onClick={() => toggleSaved(site.id)} aria-pressed={isSaved}>
          {isSaved ? <BookmarkCheck className="text-primary" aria-hidden /> : <Bookmark aria-hidden />}
          {isSaved ? t("saved") : t("save")}
        </Button>
      </div>
      <Button variant="ghost" className="mt-2 w-full text-muted-foreground" onClick={() => setCorrecting(true)}>
        <PencilLine aria-hidden />
        {t("suggestCorrection")}
      </Button>

      <p className="mt-6 border-t pt-4 text-xs text-muted-foreground">{t("sampleNote")}</p>

      <CorrectionDialog open={correcting} onOpenChange={setCorrecting} />
    </article>
  );
}

function CorrectionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useI18n();
  const { recordCorrection } = useSteward();
  const [note, setNote] = useState("");

  const send = () => {
    recordCorrection();
    toast.success(t("correctionSent"));
    setNote("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("correctionTitle")}</DialogTitle>
          <DialogDescription>{t("correctionBody")}</DialogDescription>
        </DialogHeader>
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("correctionPlaceholder")}
          rows={4}
          className="bg-card"
        />
        <DialogFooter>
          <Button onClick={send} disabled={note.trim().length < 5}>
            {t("send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
