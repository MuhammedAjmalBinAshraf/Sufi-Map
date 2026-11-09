"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import {
  Compass,
  MapPin,
  Users,
  PlusCircle,
  User,
  ShieldCheck,
  Layers,
} from "lucide-react";

interface DesktopHeaderProps {
  onOpenMapSetup?: () => void;
}

export function DesktopHeader({ onOpenMapSetup }: DesktopHeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/",
      label: t("nav.map"),
      icon: MapPin,
      active: pathname === "/" || pathname === "",
    },
    {
      href: "/gatherings",
      label: t("nav.gatherings"),
      icon: Users,
      active: pathname.startsWith("/gatherings"),
    },
    {
      href: "/contribute",
      label: t("nav.contribute"),
      icon: PlusCircle,
      active: pathname.startsWith("/contribute"),
    },
    {
      href: "/admin",
      label: "Moderation",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin"),
    },
    {
      href: "/me",
      label: t("nav.me"),
      icon: User,
      active: pathname.startsWith("/me"),
    },
  ];

  return (
    <header className="hidden md:flex sticky top-0 z-50 h-16 w-full bg-white/95 backdrop-blur-md border-b border-border px-6 items-center justify-between shadow-xs">
      {/* Brand Identity */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 transition-transform group-hover:scale-105">
          <Compass className="w-5 h-5 text-primary animate-[spin_60s_linear_infinite]" />
        </div>
        <div>
          <span className="font-serif text-lg font-bold tracking-tight text-foreground leading-none block">
            {t("common.title")}
          </span>
          <span className="text-[11px] text-muted-foreground font-normal leading-tight block">
            {t("common.tagline")}
          </span>
        </div>
      </Link>

      {/* Center Navigation Links */}
      <nav className="flex items-center gap-1 bg-sahn-bg/80 border border-border/70 p-1 rounded-full">
        {navLinks.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                item.active
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Controls: Map Setup, Language, Add CTA */}
      <div className="flex items-center gap-2.5">
        {onOpenMapSetup && (
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenMapSetup}
            className="h-9 px-3 rounded-full text-xs text-muted-foreground hover:text-foreground border-border flex items-center gap-1.5 hover:bg-sahn-bg"
          >
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Map Setup</span>
          </Button>
        )}

        <LocaleSwitcher />

        <Link href="/contribute">
          <Button
            size="sm"
            className="h-9 px-4 rounded-full bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/95 flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Sacred Place</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
