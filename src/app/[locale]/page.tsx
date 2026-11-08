import { MapHomeClient } from "@/components/map/MapHomeClient";
import { BottomNav } from "@/components/navigation/BottomNav";
import { SAMPLE_PLACES } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  let places = SAMPLE_PLACES;

  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("places")
        .select("*")
        .eq("status", "approved");

      if (!error && data && data.length > 0) {
        places = data as any;
      }
    }
  } catch (err) {
    // Fallback to verified SAMPLE_PLACES for offline/development resilience
    places = SAMPLE_PLACES;
  }

  return (
    <main className="relative flex-1 flex flex-col min-h-screen bg-sahn-bg">
      <MapHomeClient initialPlaces={places} />
      <BottomNav />
    </main>
  );
}
