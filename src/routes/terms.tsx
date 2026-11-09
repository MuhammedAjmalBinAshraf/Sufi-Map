import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Sufi Map" },
      {
        name: "description",
        content: "Terms of service and community stewardship guidelines for Sufi Map.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="size-4 rtl:-scale-x-100" />
            <span>Back to Map</span>
          </Link>
          <div className="flex items-center gap-2 font-serif font-semibold text-lg">
            <BookOpen className="size-5 text-primary" />
            <span>Sufi Map</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Terms of Service
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-mono">
              Last updated: November 10, 2026
            </p>
          </div>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">1. Agreement to Terms</h2>
            <p>
              By accessing or using <strong>Sufi Map</strong> (<a href="https://sufi-map.vercel.app" className="text-primary underline">https://sufi-map.vercel.app</a>), 
              you agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using the platform.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">2. Purpose & Nature of the Platform</h2>
            <p>
              Sufi Map is a calm, contemplative digital sanctuary dedicated to documenting and mapping historical Sufi dargahs, maqams, zawiyas, and spiritual halqas across Kerala.
              The application is maintained by community stewards to facilitate peaceful visitation, historical inquiry, and respect for Kerala's spiritual heritage.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">3. Contributor Guidelines & Ethical Conduct</h2>
            <p>Users who contribute listings, corrections, or sources agree to the following sacred covenants:</p>
            <ul className="list-disc ps-6 space-y-1.5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Authentic Attribution:</strong> Every entry must be accompanied by credible historical citations (books, manuscripts, historical records, or named local elders). No fabricated information may be submitted.
              </li>
              <li>
                <strong className="text-foreground">Consent for Living Scholars:</strong> Any listing mentioning a living teacher requires verified explicit consent. Private residences, personal phone numbers, or private quarters are strictly prohibited.
              </li>
              <li>
                <strong className="text-foreground">Respectful Etiquette:</strong> Entries should promote adab (spiritual decorum), community peace, and mutual respect among all visitors.
              </li>
            </ul>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">4. User Accounts & Security</h2>
            <p>
              When registering an account via Google OAuth or email, you are responsible for maintaining the confidentiality of your credentials. 
              We reserve the right to suspend or terminate accounts that violate community safety or ethical norms.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">5. Intellectual Property & Community Commons</h2>
            <p>
              Historical quotations, sacred texts, and public domain historical citations belong to the collective heritage of the community. 
              Original software code and Sahn design system assets are protected. User contributions are provided under a community commons framework for preservation and public spiritual benefit.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">6. Disclaimer of Warranties</h2>
            <p>
              Sufi Map is provided on an "as is" and "as available" basis. While our stewards take great care to verify sources, 
              we make no warranties regarding uninterrupted availability or exact GPS road accessibility under changing local weather or topography.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">7. Changes to Terms</h2>
            <p>
              We may revise these Terms of Service periodically. Continued use of the platform after updates constitutes acceptance of the amended terms.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">8. Contact Us</h2>
            <p>
              For inquiries regarding these Terms of Service, please contact:
            </p>
            <p className="font-mono text-sm text-primary">
              legal@sufimap.org
            </p>
          </section>

          <div className="pt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>© 2026 Sufi Map. All rights reserved.</span>
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
