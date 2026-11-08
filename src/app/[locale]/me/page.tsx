"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { BadgeProgressCard } from "@/components/badges/BadgeProgressCard";
import { BottomNav } from "@/components/navigation/BottomNav";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  ShieldCheck,
  Compass,
  LogOut,
  LogIn,
  ChevronRight,
  Plus,
} from "lucide-react";

export default function MePage() {
  const t = useTranslations("auth");
  const [user, setUser] = useState<any>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
    } catch {
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-sahn-bg pb-24">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground leading-none">
                Contributor Sanctuary
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Profile & Badges
              </p>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 flex flex-col gap-4">
        {user ? (
          /* Logged In Contributor Profile Card */
          <Card className="rounded-[14px] border-border bg-white shadow-sm overflow-hidden">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-serif text-lg font-semibold">
                    {(user.user_metadata?.full_name || user.email || "C")
                      .substring(0, 1)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-serif text-base font-bold text-foreground">
                      {user.user_metadata?.full_name || "Blessed Contributor"}
                    </h2>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-transparent text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                >
                  Contributor
                </Badge>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Link href="/contribute">
                  <Button
                    size="sm"
                    className="w-full h-9 rounded-[10px] bg-primary text-primary-foreground text-xs flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Contribute</span>
                  </Button>
                </Link>

                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-9 rounded-[10px] border-border text-foreground text-xs flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    <span>Moderation</span>
                  </Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="mt-1 h-8 text-xs text-muted-foreground hover:text-destructive flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("signOut")}</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Guest Profile Prompt */
          <Card className="rounded-[14px] border-border bg-white shadow-sm p-5 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Compass className="w-6 h-6 animate-[spin_40s_linear_infinite]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Join Sufi Map as a Contributor
              </h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                Sign in with your email to submit places, suggest corrections, and earn everyday badges like Musafir, Misbah, and Hadiyya.
              </p>
            </div>
            <Button
              onClick={() => setAuthDialogOpen(true)}
              className="h-10 px-6 rounded-[12px] bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 flex items-center gap-2 shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>{t("signIn")} / {t("signUp")}</span>
            </Button>
          </Card>
        )}

        {/* Badges of Stewardship Progress Card */}
        <BadgeProgressCard
          stats={{
            approvedEntriesCount: user ? 1 : 0,
            sourcedEntriesCount: user ? 1 : 0,
            verifiedOthersCount: 0,
            isNazir: false,
          }}
        />
      </main>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onSuccess={checkUser}
      />
      <BottomNav />
    </div>
  );
}
