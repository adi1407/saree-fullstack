"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Sheet } from "@/components/ui/Sheet.client";
import { BrandLogo } from "@/components/brand/BrandLogo";
import {
  MOBILE_DISCOVER_LINKS,
  MOBILE_HELP_LINKS,
  MOBILE_SHOP_LINKS,
  isNavPathActive,
} from "@/content/navigation";
import { apiClient } from "@/lib/api";
import { ApiResponse, User } from "@/lib/types";
import { cn } from "@/lib/utils";

function NavSection({
  title,
  links,
  pathname,
  onNavigate,
}: {
  title: string;
  links: { href: string; label: string }[];
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="mb-4">
      <p className="text-eyebrow py-2 text-secondary">{title}</p>
      <div className="grid gap-0.5">
        {links.map((link) => {
          const active = isNavPathActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center rounded-sm border-l-2 px-3 py-2.5 text-small tracking-wide transition-colors",
                active
                  ? "border-secondary bg-white/10 text-secondary"
                  : "border-transparent text-white/75 hover:border-white/20 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    apiClient
      .get<ApiResponse<User>>("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="touch-target focus-luxury relative z-30 -ml-2 shrink-0 text-text-muted hover:text-primary lg:hidden"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        variant="dark"
        showHeader={false}
      >
        <div className="-mx-1 flex min-h-full flex-col">
          <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-5">
            <BrandLogo href="/" onNavigate={() => setOpen(false)} variant="admin" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="touch-target text-white/60 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <NavSection
              title="Shop"
              links={MOBILE_SHOP_LINKS}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <NavSection
              title="Discover"
              links={MOBILE_DISCOVER_LINKS}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
            <NavSection
              title="Help"
              links={MOBILE_HELP_LINKS}
              pathname={pathname}
              onNavigate={() => setOpen(false)}
            />
          </div>

          <div className="mt-4 space-y-1 border-t border-white/10 pt-5">
            <Link
              href={user ? "/account" : "/login"}
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-sm px-3 text-small text-white/75 hover:bg-white/5 hover:text-white"
            >
              {user ? "My Account" : "Sign In"}
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center rounded-sm px-3 text-small text-white/75 hover:bg-white/5 hover:text-white"
            >
              Shopping Bag
            </Link>
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-sm px-3 text-small text-secondary hover:bg-white/5"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </Sheet>
    </>
  );
}
