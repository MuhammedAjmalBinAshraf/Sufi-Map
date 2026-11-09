"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { MapPin, Users, PlusCircle, User } from "lucide-react";

export function BottomNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: t("map"),
      icon: MapPin,
      active: pathname === "/" || pathname === "",
    },
    {
      href: "/gatherings",
      label: t("gatherings"),
      icon: Users,
      active: pathname.startsWith("/gatherings"),
    },
    {
      href: "/contribute",
      label: t("contribute"),
      icon: PlusCircle,
      active: pathname.startsWith("/contribute"),
    },
    {
      href: "/me",
      label: t("me"),
      icon: User,
      active: pathname.startsWith("/me"),
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border px-3 py-2 pb-safe shadow-[0_-2px_10px_rgba(0,0,0,0.03)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors duration-150 ${
                item.active
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-150 ${
                  item.active ? "stroke-[2.25] scale-105" : "stroke-[1.75]"
                }`}
              />
              <span className="text-[11px] tracking-tight mt-1 leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
