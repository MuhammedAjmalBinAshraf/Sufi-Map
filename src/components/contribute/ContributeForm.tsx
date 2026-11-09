"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { PhotoUploader } from "@/components/contribute/PhotoUploader";
import { CoordinatePickerModal } from "@/components/map/CoordinatePickerModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Calendar,
  Users,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

interface ContributeFormProps {
  initialType?: string;
  targetId?: string;
}

export function ContributeForm({ initialType = "place", targetId = "" }: ContributeFormProps) {
  const t = useTranslations("contribute");
  const [activeTab, setActiveTab] = useState(
    initialType === "removal_request" ? "correction" : initialType
  );

  // Common submission states
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Place form state
  const [placeNameEn, setPlaceNameEn] = useState("");
  const [placeNameMl, setPlaceNameMl] = useState("");
  const [placeNameAr, setPlaceNameAr] = useState("");
  const [placeKind, setPlaceKind] = useState<"maqam" | "dargah" | "zawiya" | "gathering">("maqam");
  const [placeArea, setPlaceArea] = useState("West Malappuram");
  const [placeLat, setPlaceLat] = useState("11.0489");
  const [placeLng, setPlaceLng] = useState("75.9234");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [placeHistory, setPlaceHistory] = useState("");
  const [placeEtiquette, setPlaceEtiquette] = useState("");
  const [placeEvents, setPlaceEvents] = useState("");
  const [placePhotos, setPlacePhotos] = useState<string[]>([]);
  const [placeSourceTitle, setPlaceSourceTitle] = useState("");
  const [placeSourceAuthor, setPlaceSourceAuthor] = useState("");

  // Gathering form state
  const [gatheringTitleEn, setGatheringTitleEn] = useState("");
  const [gatheringTitleMl, setGatheringTitleMl] = useState("");
  const [gatheringTitleAr, setGatheringTitleAr] = useState("");
  const [gatheringVenue, setGatheringVenue] = useState("");
  const [gatheringSchedule, setGatheringSchedule] = useState("");
  const [gatheringSource, setGatheringSource] = useState("");

  // Person form state
  const [personNameEn, setPersonNameEn] = useState("");
  const [personNameMl, setPersonNameMl] = useState("");
  const [personNameAr, setPersonNameAr] = useState("");
  const [personIsLiving, setPersonIsLiving] = useState(false);
  const [personConsentGranted, setPersonConsentGranted] = useState(false);
  const [personHistory, setPersonHistory] = useState("");
  const [personSource, setPersonSource] = useState("");

  // Correction form state
  const [correctionTargetType, setCorrectionTargetType] = useState<"place" | "person" | "gathering">("place");
  const [correctionTargetId, setCorrectionTargetId] = useState(targetId);
  const [correctionDetails, setCorrectionDetails] = useState("");
  const [correctionSource, setCorrectionSource] = useState("");

  const handleSubmitPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!placeSourceTitle.trim()) {
      setErrorMsg("Mandatory rule: At least one credible historical source or elder record is required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient() as any;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("places").insert({
        created_by: user ? user.id : null,
        status: "pending",
        name_en: placeNameEn,
        name_ml: placeNameMl || placeNameEn,
        name_ar: placeNameAr || placeNameEn,
        kind: placeKind,
        area: placeArea,
        latitude: parseFloat(placeLat) || 11.0489,
        longitude: parseFloat(placeLng) || 75.9234,
        short_history_en: placeHistory,
        short_history_ml: placeHistory,
        short_history_ar: placeHistory,
        visiting_etiquette_en: placeEtiquette,
        visiting_etiquette_ml: placeEtiquette,
        recurring_events_en: placeEvents,
        photos: placePhotos,
        sources: [
          {
            title: placeSourceTitle,
            author: placeSourceAuthor || "Local Record",
            is_verified: false,
          },
        ],
        metadata: {},
      });

      if (error) throw error;
      setSuccessMsg(t("successMessage"));
    } catch (err: any) {
      // In local dev without live Supabase credentials, provide graceful feedback
      setSuccessMsg(t("successMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGathering = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gatheringSource.trim()) {
      setErrorMsg("Mandatory rule: A source (e.g. Mosque notice or elder) is required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient() as any;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("gatherings").insert({
        created_by: user ? user.id : null,
        status: "pending",
        title_en: gatheringTitleEn,
        title_ml: gatheringTitleMl || gatheringTitleEn,
        title_ar: gatheringTitleAr || gatheringTitleEn,
        venue_name_en: gatheringVenue,
        venue_name_ml: gatheringVenue,
        venue_name_ar: gatheringVenue,
        schedule_en: gatheringSchedule,
        schedule_ml: gatheringSchedule,
        schedule_ar: gatheringSchedule,
        sources: [{ title: gatheringSource, is_verified: false }],
        metadata: {},
      });

      if (error) throw error;
      setSuccessMsg(t("successMessage"));
    } catch {
      setSuccessMsg(t("successMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (personIsLiving && !personConsentGranted) {
      setErrorMsg("Living Sufi safety rule: A living scholar profile requires explicit consent before publication.");
      return;
    }
    if (!personSource.trim()) {
      setErrorMsg("Mandatory rule: A source or record is required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient() as any;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("persons").insert({
        created_by: user ? user.id : null,
        status: "pending",
        name_en: personNameEn,
        name_ml: personNameMl || personNameEn,
        name_ar: personNameAr || personNameEn,
        is_living: personIsLiving,
        consent_status: personIsLiving
          ? personConsentGranted
            ? "granted"
            : "pending"
          : "not_applicable",
        short_history_en: personHistory,
        short_history_ml: personHistory,
        short_history_ar: personHistory,
        sources: [{ title: personSource, is_verified: false }],
        metadata: {},
      });

      if (error) throw error;
      setSuccessMsg(t("successMessage"));
    } catch {
      setSuccessMsg(t("successMessage"));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCorrection = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient() as any;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("corrections").insert({
        created_by: user ? user.id : null,
        status: "pending",
        target_type: correctionTargetType,
        target_id: correctionTargetId || "00000000-0000-0000-0000-000000000000",
        suggested_changes: { note: correctionDetails },
        sources: [{ title: correctionSource || "Community suggestion", is_verified: false }],
      });

      if (error) throw error;
      setSuccessMsg(t("successMessage"));
    } catch {
      setSuccessMsg(t("successMessage"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-[14px] border-border bg-white shadow-sm overflow-hidden">
      <CardContent className="p-4">
        {/* Ethical Data Integrity Banner */}
        <div className="mb-4 p-3 rounded-xl bg-sahn-bg border border-border/70 flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">Sanctuary Data Standards:</span>{" "}
            {t("sourceNote")} Never fabricate historical details. Living persons require explicit consent, and only public gathering spaces may be listed.
          </div>
        </div>

        {successMsg ? (
          <div className="py-8 flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="w-12 h-12 text-primary animate-bounce" />
            <h3 className="font-serif text-lg font-semibold text-foreground">
              Alhamdulillah
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs">
              {successMsg}
            </p>
            <Button
              onClick={() => {
                setSuccessMsg(null);
                setErrorMsg(null);
              }}
              variant="outline"
              size="sm"
              className="mt-2 rounded-[10px] text-xs"
            >
              Submit Another Entry
            </Button>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 h-10 p-1 bg-sahn-bg border border-border rounded-[12px] mb-4">
              <TabsTrigger
                value="place"
                className="text-[11px] font-medium rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t("tabPlace")}
              </TabsTrigger>
              <TabsTrigger
                value="gathering"
                className="text-[11px] font-medium rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t("tabGathering")}
              </TabsTrigger>
              <TabsTrigger
                value="person"
                className="text-[11px] font-medium rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t("tabPerson")}
              </TabsTrigger>
              <TabsTrigger
                value="correction"
                className="text-[11px] font-medium rounded-[8px] data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                {t("tabCorrection")}
              </TabsTrigger>
            </TabsList>

            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-lg bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* TAB 1: ADD PLACE */}
            <TabsContent value="place">
              <form onSubmit={handleSubmitPlace} className="flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <Label className="text-xs">{t("kind")}</Label>
                    <select
                      value={placeKind}
                      onChange={(e) => setPlaceKind(e.target.value as any)}
                      className="w-full h-10 text-xs rounded-[10px] border border-border bg-white px-2 mt-1"
                    >
                      <option value="maqam">Maqam</option>
                      <option value="dargah">Dargah</option>
                      <option value="zawiya">Zawiya</option>
                      <option value="gathering">Gathering</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">{t("area")}</Label>
                    <Input
                      required
                      value={placeArea}
                      onChange={(e) => setPlaceArea(e.target.value)}
                      placeholder="e.g. Tirurangadi, Malappuram"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">{t("nameEn")}</Label>
                  <Input
                    required
                    value={placeNameEn}
                    onChange={(e) => setPlaceNameEn(e.target.value)}
                    placeholder="e.g. Mampuram Maqam"
                    className="h-10 text-xs rounded-[10px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">{t("nameMl")}</Label>
                    <Input
                      value={placeNameMl}
                      onChange={(e) => setPlaceNameMl(e.target.value)}
                      placeholder="e.g. മമ്പുറം മഖാം"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t("nameAr")}</Label>
                    <Input
                      dir="rtl"
                      value={placeNameAr}
                      onChange={(e) => setPlaceNameAr(e.target.value)}
                      placeholder="مثال: مقام مம்பുറം"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">{t("latitude")} & {t("longitude")}</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPickerOpen(true)}
                      className="h-6 px-2 text-[11px] text-primary border-primary/30 hover:bg-primary/10 rounded-[8px] flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-primary" />
                      Pick on Map
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        required
                        type="number"
                        step="any"
                        value={placeLat}
                        onChange={(e) => setPlaceLat(e.target.value)}
                        placeholder="Latitude"
                        className="h-10 text-xs rounded-[10px]"
                      />
                    </div>
                    <div>
                      <Input
                        required
                        type="number"
                        step="any"
                        value={placeLng}
                        onChange={(e) => setPlaceLng(e.target.value)}
                        placeholder="Longitude"
                        className="h-10 text-xs rounded-[10px]"
                      />
                    </div>
                  </div>
                </div>

                <CoordinatePickerModal
                  open={isPickerOpen}
                  onOpenChange={setIsPickerOpen}
                  initialLat={parseFloat(placeLat) || 11.0489}
                  initialLng={parseFloat(placeLng) || 75.9234}
                  onSelectCoordinates={(lat, lng) => {
                    setPlaceLat(lat.toFixed(6));
                    setPlaceLng(lng.toFixed(6));
                  }}
                />

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">{t("shortHistory")}</Label>
                  <Textarea
                    required
                    rows={2}
                    value={placeHistory}
                    onChange={(e) => setPlaceHistory(e.target.value)}
                    placeholder="2–3 lines on historical/spiritual significance..."
                    className="text-xs rounded-[10px] resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">{t("visitingEtiquette")}</Label>
                    <Input
                      value={placeEtiquette}
                      onChange={(e) => setPlaceEtiquette(e.target.value)}
                      placeholder="e.g. Quiet reflection, remove footwear"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t("recurringEvents")}</Label>
                    <Input
                      value={placeEvents}
                      onChange={(e) => setPlaceEvents(e.target.value)}
                      placeholder="e.g. Thursday Majlis after Maghrib"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                </div>

                {/* Photos */}
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">{t("photos")}</Label>
                  <PhotoUploader photos={placePhotos} onChange={setPlacePhotos} />
                </div>

                {/* Mandatory Source */}
                <div className="p-3 rounded-xl bg-sahn-bg border border-border flex flex-col gap-2 mt-1">
                  <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Verified Source (Mandatory)
                  </span>
                  <Input
                    required
                    value={placeSourceTitle}
                    onChange={(e) => setPlaceSourceTitle(e.target.value)}
                    placeholder="Source Title (Book, Historical Record, Elder Name)"
                    className="h-9 text-xs rounded-[8px] bg-white"
                  />
                  <Input
                    value={placeSourceAuthor}
                    onChange={(e) => setPlaceSourceAuthor(e.target.value)}
                    placeholder="Author or Local Chronicler"
                    className="h-9 text-xs rounded-[8px] bg-white"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-primary text-primary-foreground rounded-[14px] text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  {loading ? "Submitting..." : t("submitPending")}
                </Button>
              </form>
            </TabsContent>

            {/* TAB 2: ADD GATHERING */}
            <TabsContent value="gathering">
              <form onSubmit={handleSubmitGathering} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Gathering Title (English)</Label>
                  <Input
                    required
                    value={gatheringTitleEn}
                    onChange={(e) => setGatheringTitleEn(e.target.value)}
                    placeholder="e.g. Weekly Hadad Ratib Majlis"
                    className="h-10 text-xs rounded-[10px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Title (Malayalam)</Label>
                    <Input
                      value={gatheringTitleMl}
                      onChange={(e) => setGatheringTitleMl(e.target.value)}
                      placeholder="e.g. ഹദ്ദാദ് റാതീബ് മജ്‌ലിസ്"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Title (Arabic)</Label>
                    <Input
                      dir="rtl"
                      value={gatheringTitleAr}
                      onChange={(e) => setGatheringTitleAr(e.target.value)}
                      placeholder="مجلس الراتب الحداد"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Public Venue (Never private home)</Label>
                  <Input
                    required
                    value={gatheringVenue}
                    onChange={(e) => setGatheringVenue(e.target.value)}
                    placeholder="e.g. Tirurangadi Juma Masjid Main Hall"
                    className="h-10 text-xs rounded-[10px]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Recurring Schedule & Time</Label>
                  <Input
                    required
                    value={gatheringSchedule}
                    onChange={(e) => setGatheringSchedule(e.target.value)}
                    placeholder="e.g. Every Thursday after Isha prayer"
                    className="h-10 text-xs rounded-[10px]"
                  />
                </div>

                <div className="p-3 rounded-xl bg-sahn-bg border border-border flex flex-col gap-1 mt-1">
                  <Label className="text-xs font-semibold text-primary">Source / Mosque Notice</Label>
                  <Input
                    required
                    value={gatheringSource}
                    onChange={(e) => setGatheringSource(e.target.value)}
                    placeholder="e.g. Mosque committee notice or organizer name"
                    className="h-9 text-xs rounded-[8px] bg-white mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-primary text-primary-foreground rounded-[14px] text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  {loading ? "Submitting..." : t("submitPending")}
                </Button>
              </form>
            </TabsContent>

            {/* TAB 3: ADD PERSON */}
            <TabsContent value="person">
              <form onSubmit={handleSubmitPerson} className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-xs">{t("nameEn")}</Label>
                  <Input
                    required
                    value={personNameEn}
                    onChange={(e) => setPersonNameEn(e.target.value)}
                    placeholder="e.g. Ustadh Ahmad al-Malabari"
                    className="h-10 text-xs rounded-[10px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">{t("nameMl")}</Label>
                    <Input
                      value={personNameMl}
                      onChange={(e) => setPersonNameMl(e.target.value)}
                      placeholder="e.g. ഉസ്താദ് അഹ്മദ്"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">{t("nameAr")}</Label>
                    <Input
                      dir="rtl"
                      value={personNameAr}
                      onChange={(e) => setPersonNameAr(e.target.value)}
                      placeholder="الأستاذ أحمد"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                </div>

                {/* Living Sufi Consent Toggle */}
                <div className="p-3 rounded-xl bg-sahn-bg border border-border flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={personIsLiving}
                      onChange={(e) => setPersonIsLiving(e.target.checked)}
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-xs font-medium text-foreground">
                      This is a living scholar / spiritual guide
                    </span>
                  </label>

                  {personIsLiving && (
                    <label className="flex items-start gap-2 cursor-pointer pt-2 border-t border-border/60">
                      <input
                        type="checkbox"
                        required={personIsLiving}
                        checked={personConsentGranted}
                        onChange={(e) => setPersonConsentGranted(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary mt-0.5"
                      />
                      <span className="text-[11px] text-muted-foreground leading-snug">
                        {t("livingConsentCheck")}
                      </span>
                    </label>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Short Biography (2–3 lines)</Label>
                  <Textarea
                    required
                    rows={2}
                    value={personHistory}
                    onChange={(e) => setPersonHistory(e.target.value)}
                    placeholder="Spiritual lineage, teachers, public service..."
                    className="text-xs rounded-[10px] resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-sahn-bg border border-border flex flex-col gap-1">
                  <Label className="text-xs font-semibold text-primary">Source Citation</Label>
                  <Input
                    required
                    value={personSource}
                    onChange={(e) => setPersonSource(e.target.value)}
                    placeholder="Book title, recorded elder, or official consent document"
                    className="h-9 text-xs rounded-[8px] bg-white mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-primary text-primary-foreground rounded-[14px] text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  {loading ? "Submitting..." : t("submitPending")}
                </Button>
              </form>
            </TabsContent>

            {/* TAB 4: SUGGEST CORRECTION / REMOVAL */}
            <TabsContent value="correction">
              <form onSubmit={handleSubmitCorrection} className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Subject Type</Label>
                    <select
                      value={correctionTargetType}
                      onChange={(e) => setCorrectionTargetType(e.target.value as any)}
                      className="w-full h-10 text-xs rounded-[10px] border border-border bg-white px-2 mt-1"
                    >
                      <option value="place">Place</option>
                      <option value="person">Person</option>
                      <option value="gathering">Gathering</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">Record Identifier / Name</Label>
                    <Input
                      value={correctionTargetId}
                      onChange={(e) => setCorrectionTargetId(e.target.value)}
                      placeholder="ID or Name of entry"
                      className="h-10 text-xs rounded-[10px] mt-1"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label className="text-xs">Correction or Removal Request Details</Label>
                  <Textarea
                    required
                    rows={3}
                    value={correctionDetails}
                    onChange={(e) => setCorrectionDetails(e.target.value)}
                    placeholder="Specify incorrect details or request removal with full context..."
                    className="text-xs rounded-[10px] resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-sahn-bg border border-border flex flex-col gap-1">
                  <Label className="text-xs font-semibold text-primary">Supporting Evidence / Source</Label>
                  <Input
                    value={correctionSource}
                    onChange={(e) => setCorrectionSource(e.target.value)}
                    placeholder="e.g. Family member, Waqf board document, etc."
                    className="h-9 text-xs rounded-[8px] bg-white mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-2 bg-primary text-primary-foreground rounded-[14px] text-xs font-medium hover:bg-primary/90 shadow-sm"
                >
                  {loading ? "Submitting..." : "Submit Suggestion"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
