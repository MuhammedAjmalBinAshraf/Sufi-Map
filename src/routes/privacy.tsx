import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Sufi Map" },
      {
        name: "description",
        content: "Privacy policy and data protection practices for Sufi Map, including Google OAuth authentication.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            <Shield className="size-5 text-primary" />
            <span>Sufi Map</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-2 text-sm text-muted-foreground font-mono">
              Last updated: November 10, 2026
            </p>
          </div>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">1. Introduction</h2>
            <p>
              Welcome to <strong>Sufi Map</strong> (<a href="https://sufi-map.vercel.app" className="text-primary underline">https://sufi-map.vercel.app</a>). 
              Sufi Map is a tranquil, community-supported digital sanctuary mapping Sufi dargahs, maqams, zawiyas, and spiritual gatherings across Kerala, India.
            </p>
            <p>
              We are committed to protecting the privacy, dignity, and personal data of our visitors, contributors, and the living scholars documented on this platform.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">2. Information We Collect</h2>
            <p>We collect only the minimal information necessary to deliver our services:</p>
            <ul className="list-disc ps-6 space-y-1.5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Authentication Data (Google OAuth & Email):</strong> When you choose to sign in using Google or email, we receive your email address, full name, and avatar image to authenticate your contributor account.
              </li>
              <li>
                <strong className="text-foreground">Community Contributions:</strong> Place suggestions, corrections, historical source citations, and notes you voluntarily submit.
              </li>
              <li>
                <strong className="text-foreground">Device Preferences:</strong> Language settings (English, Malayalam, Arabic) and map preferences stored locally on your device via browser local storage.
              </li>
            </ul>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">3. Google User Data & OAuth Disclosures</h2>
            <p>
              Sufi Map uses Google OAuth 2.0 strictly for user authentication. In compliance with Google's API Services User Data Policy:
            </p>
            <ul className="list-disc ps-6 space-y-1.5 text-muted-foreground">
              <li>We request only standard profile and email scopes (<code>openid</code>, <code>email</code>, <code>profile</code>).</li>
              <li>We use this data solely to sign you in, maintain your contributor session, and display your name on contributions you make.</li>
              <li>We do <strong>not</strong> sell, rent, or share Google user data with third-party advertisers or data brokers.</li>
              <li>We do <strong>not</strong> use your personal data for advertising or marketing campaigns.</li>
            </ul>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">4. Strict Living Sufi Privacy Rules</h2>
            <p>
              In accordance with our ethical sanctuary guidelines, any listing involving a living teacher or guide strictly requires verified consent. 
              We strictly forbid publishing private residences or personal contact details. Only public gathering spaces (such as masjids, zawiyas, and public halls) are permitted.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">5. Data Security & Storage</h2>
            <p>
              Your account data is securely stored and authenticated through Supabase with end-to-end TLS encryption in transit and encrypted data storage at rest.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">6. Your Rights & Data Deletion</h2>
            <p>
              You have the right to access, rectify, or request deletion of your account and contributions at any time. 
              To request full deletion of your user account and personal data, please contact us.
            </p>
          </section>

          <section className="space-y-3 leading-relaxed text-sm text-foreground/90">
            <h2 className="font-serif text-xl font-medium text-foreground">7. Contact Information</h2>
            <p>
              For any questions regarding this Privacy Policy or your personal data, please reach out to our stewards at:
            </p>
            <p className="font-mono text-sm text-primary">
              privacy@sufimap.org
            </p>
          </section>

          <div className="pt-6 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>© 2026 Sufi Map. All rights reserved.</span>
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
