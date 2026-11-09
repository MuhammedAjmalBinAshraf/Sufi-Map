import { MapHomeClient } from "@/components/map/MapHomeClient";
import { BottomNav } from "@/components/navigation/BottomNav";
import { SAMPLE_PLACES, SAMPLE_QUOTES } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  let places = SAMPLE_PLACES;
  let quotes = SAMPLE_QUOTES;

  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = createClient();
      const [placesRes, quotesRes] = await Promise.all([
        supabase.from("places").select("*").eq("status", "approved"),
        supabase.from("quotes").select("*").eq("active", true),
      ]);

      if (!placesRes.error && placesRes.data && placesRes.data.length > 0) {
        places = placesRes.data as any;
      }
      if (!quotesRes.error && quotesRes.data && quotesRes.data.length > 0) {
        quotes = quotesRes.data as any;
      }
    }
  } catch (err) {
    places = SAMPLE_PLACES;
    quotes = SAMPLE_QUOTES;
  }

  return (
    <main className="relative flex-1 flex flex-col min-h-screen bg-sahn-bg">
      <MapHomeClient initialPlaces={places} quotes={quotes} />
      <BottomNav />
    </main>
  );
}
