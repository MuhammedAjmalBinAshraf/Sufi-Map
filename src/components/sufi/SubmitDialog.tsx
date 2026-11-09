import { useState, type ReactNode } from "react";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useI18n, type I18nKey } from "@/lib/i18n";
import { DISTRICT_KEYS, DISTRICTS, SITE_KINDS, type SiteKind } from "@/lib/sites";
import { useSteward } from "@/lib/steward";
import { EMPTY_DRAFT, SOURCE_TYPES, validateStep, type SubmissionDraft } from "@/lib/submission";
import { cn } from "@/lib/utils";

import { CoordinatePicker } from "./CoordinatePicker";

const STEPS: I18nKey[] = ["step.place", "step.location", "step.source", "step.review"];

export function SubmitDialog({
  open,
  onOpenChange,
  onRequireAuth,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onRequireAuth?: () => void;
}) {
  const { t, pick } = useI18n();
  const { user } = useAuth();
  const { recordSubmission } = useSteward();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<SubmissionDraft>(EMPTY_DRAFT);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!user) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md p-6 text-center space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="size-6" aria-hidden />
          </div>
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-xl font-serif">{t("signInRequired")}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {t("signInToContributeDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t("close")}
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                onRequireAuth?.();
              }}
            >
              {t("signIn")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const update = <K extends keyof SubmissionDraft>(key: K, value: SubmissionDraft[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setErrors((e) => {
      const { [key]: _removed, ...rest } = e;
      return rest;
    });
  };

  const reset = () => {
    setStep(0);
    setDraft(EMPTY_DRAFT);
    setErrors({});
  };

  const next = () => {
    const found = validateStep(step, draft);
    setErrors(found);
    if (Object.keys(found).length === 0) setStep((s) => s + 1);
  };

  const submit = () => {
    for (let s = 0; s < 3; s++) {
      const found = validateStep(s, draft);
      if (Object.keys(found).length > 0) {
        setErrors(found);
        setStep(s);
        return;
      }
    }
    recordSubmission();
    toast.success(t("submitted"));
    onOpenChange(false);
    reset();
  };

  const err = (key: string) => (errors[key] ? t(errors[key] as I18nKey) : undefined);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-lg gap-0 overflow-y-auto p-0">
        <DialogHeader className="border-b p-6 pb-5">
          <DialogTitle className="text-2xl">{t("submitTitle")}</DialogTitle>
          <DialogDescription>{t("submitIntro")}</DialogDescription>
          <ol className="flex gap-1.5 pt-4" aria-label={t("stepOf", { a: step + 1, b: STEPS.length })}>
            {STEPS.map((label, i) => (
              <li key={label} className="flex-1">
                <div
                  className={cn(
                    "h-1 rounded-full transition-colors duration-250 ease-out",
                    i <= step ? "bg-primary" : "bg-border",
                  )}
                />
                <span
                  className={cn("mt-1.5 block text-[11px]", i === step ? "font-medium text-foreground" : "text-muted-foreground")}
                >
                  {t(label)}
                </span>
              </li>
            ))}
          </ol>
        </DialogHeader>

        <div key={step} className="animate-in fade-in-0 space-y-4 p-6 duration-300">
          {step === 0 && (
            <>
              <Field id="name" label={t("name")} error={err("name")}>
                <Input id="name" value={draft.name} onChange={(e) => update("name", e.target.value)} placeholder={t("namePlaceholder")} className="bg-card" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field id="kind" label={t("kind")} error={err("kind")}>
                  <Select value={draft.kind} onValueChange={(v) => update("kind", v)}>
                    <SelectTrigger id="kind" className="bg-card">
                      <SelectValue placeholder={t("choose")} />
                    </SelectTrigger>
                    <SelectContent>
                      {SITE_KINDS.map((k) => (
                        <SelectItem key={k} value={k}>
                          {t(`kind.${k}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="district" label={t("district")} error={err("district")}>
                  <Select value={draft.district} onValueChange={(v) => update("district", v)}>
                    <SelectTrigger id="district" className="bg-card">
                      <SelectValue placeholder={t("choose")} />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTRICT_KEYS.map((d) => (
                        <SelectItem key={d} value={d}>
                          {pick(DISTRICTS[d])}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field id="description" label={t("description")} error={err("description")}>
                <Textarea
                  id="description"
                  rows={4}
                  value={draft.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder={t("descriptionPlaceholder")}
                  className="bg-card"
                />
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <CoordinatePicker
                lat={draft.lat}
                lng={draft.lng}
                kind={(SITE_KINDS as readonly string[]).includes(draft.kind) ? (draft.kind as SiteKind) : undefined}
                onChange={(lat, lng) => {
                  update("lat", lat);
                  update("lng", lng);
                }}
              />
              {err("lat") && <p className="text-sm text-destructive">{err("lat")}</p>}
            </>
          )}

          {step === 2 && (
            <>
              <Field id="sourceType" label={t("sourceType")} error={err("sourceType")}>
                <Select value={draft.sourceType} onValueChange={(v) => update("sourceType", v)}>
                  <SelectTrigger id="sourceType" className="bg-card">
                    <SelectValue placeholder={t("choose")} />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCE_TYPES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`source.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field id="sourceCitation" label={`${t("citation")} *`} error={err("sourceCitation")}>
                <Input
                  id="sourceCitation"
                  value={draft.sourceCitation}
                  onChange={(e) => update("sourceCitation", e.target.value)}
                  placeholder={t("citationPlaceholder")}
                  className="bg-card"
                />
              </Field>
              <Field id="sourceUrl" label={t("sourceUrl")} error={err("sourceUrl")}>
                <Input
                  id="sourceUrl"
                  type="url"
                  dir="ltr"
                  value={draft.sourceUrl}
                  onChange={(e) => update("sourceUrl", e.target.value)}
                  placeholder="https://"
                  className="bg-card"
                />
              </Field>

              <div className="space-y-3 rounded-[14px] border bg-accent p-4">
                <ConsentRow
                  id="involvesLiving"
                  checked={draft.involvesLiving}
                  onChange={(v) => {
                    update("involvesLiving", v);
                    if (!v) update("livingConsent", false);
                  }}
                  label={t("livingToggle")}
                  hint={t("livingToggleHint")}
                />
                {draft.involvesLiving && (
                  <div className="animate-in fade-in-0 slide-in-from-top-1 space-y-3 border-t pt-3 duration-250">
                    <ConsentRow
                      id="livingConsent"
                      checked={draft.livingConsent}
                      onChange={(v) => update("livingConsent", v)}
                      label={t("livingConsent")}
                    />
                    {err("livingConsent") && <p className="text-sm text-destructive">{err("livingConsent")}</p>}
                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                      {t("livingNote")}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <dl className="space-y-3 rounded-[14px] border bg-accent p-4 text-sm">
              <div>
                <dt className="font-serif text-lg">{draft.name}</dt>
                <dd className="text-muted-foreground">
                  {t(`kind.${draft.kind as SiteKind}`)} · {pick(DISTRICTS[draft.district as keyof typeof DISTRICTS])}
                </dd>
              </div>
              <dd className="leading-relaxed">{draft.description}</dd>
              <div>
                <dt className="text-xs text-muted-foreground">{t("reviewCoords")}</dt>
                <dd dir="ltr" className="text-start">
                  {draft.lat}, {draft.lng}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{t("reviewSource")}</dt>
                <dd>
                  {t(`source.${draft.sourceType as (typeof SOURCE_TYPES)[number]}`)} — {draft.sourceCitation}
                </dd>
              </div>
              {draft.involvesLiving && (
                <dd className="flex items-center gap-2 text-primary">
                  <Check className="size-4" aria-hidden />
                  {t("reviewLiving")}
                </dd>
              )}
            </dl>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 border-t p-4 px-6">
          <span className="text-xs text-muted-foreground">{t("stepOf", { a: step + 1, b: STEPS.length })}</span>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                {t("previous")}
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={next}>{t("next")}</Button>
            ) : (
              <Button onClick={submit}>{t("submit")}</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error: string | undefined; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

function ConsentRow({
  id,
  checked,
  onChange,
  label,
  hint,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor={id} className="leading-snug">
          {label}
        </Label>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
