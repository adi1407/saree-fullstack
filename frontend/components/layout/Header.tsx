"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingBag, User } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { MobileNav } from "@/components/layout/MobileNav.client";
import { CLOSE_DELAY_MS, DesktopNav } from "@/components/layout/DesktopNav.client";
import { SearchDialog } from "@/features/catalog/components/SearchDialog.client";
import { apiClient } from "@/lib/api";
import { ApiResponse, CartItem, User as UserType } from "@/lib/types";

export function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);
  const hiddenRef = useRef(false);
  const activeMenuRef = useRef<string | null>(null);

  useEffect(() => {
    activeMenuRef.current = activeMenu;
  }, [activeMenu]);

  const isHome = pathname === "/";
  const compact = scrolled;

  const cancelMenuClose = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleMenuClose = () => {
    cancelMenuClose();
    closeTimerRef.current = setTimeout(() => setActiveMenu(null), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 16);

        const shouldHide = y > 120 && y > lastScrollY.current && !activeMenuRef.current;
        if (shouldHide !== hiddenRef.current) {
          hiddenRef.current = shouldHide;
          setHidden(shouldHide);
        }

        lastScrollY.current = y;
        if (y > 48 && activeMenuRef.current) setActiveMenu(null);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    apiClient
      .get<ApiResponse<UserType & { addresses?: unknown[] }>>("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));

    apiClient
      .get<ApiResponse<{ items: CartItem[]; subtotal: number }>>("/api/cart")
      .then((res) => {
        const count = res.data.items.reduce((sum, i) => sum + i.qty, 0);
        setCartCount(count);
      })
      .catch(() => setCartCount(0));
  }, [pathname]);

  const iconClass = "touch-target text-text-muted transition-colors hover:text-primary";

  return (
    <header
      className={cn(
        "sticky top-0 z-[60] transition-[transform,background-color,box-shadow,border-color] duration-500",
        hidden && !activeMenu ? "-translate-y-full" : "translate-y-0",
        activeMenu
          ? "border-b border-border/80 bg-surface/98 shadow-[var(--shadow-soft)] backdrop-blur-xl"
          : scrolled
            ? "border-b border-secondary/30 bg-background/95 shadow-[var(--shadow-soft)] backdrop-blur-xl"
            : isHome
              ? "border-b border-border/40 bg-background/88 backdrop-blur-xl"
              : "border-b border-border/50 bg-background/95 backdrop-blur-md"
      )}
    >
      <Container>
        <div
          className={cn(
            "relative grid grid-cols-[auto_1fr_auto] items-center gap-3 transition-[height] duration-300 sm:gap-4",
            compact ? "h-16" : "h-[4.5rem]"
          )}
        >
          <div className="flex min-w-0 items-center gap-1 sm:gap-2">
            <MobileNav />
            <BrandLogo priority variant="navbar" />
          </div>

          <div className="hidden min-w-0 justify-center lg:flex">
            <DesktopNav
              activeMenu={activeMenu}
              onMenuChange={setActiveMenu}
              onZoneEnter={cancelMenuClose}
              onZoneLeave={scheduleMenuClose}
            />
          </div>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search sarees"
              className={iconClass}
            >
              <Search className="h-5 w-5" />
            </button>
            <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />

            <Link href={user ? "/account" : "/login"} aria-label="Account" className={iconClass}>
              <User className="h-5 w-5" />
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="touch-target hidden items-center text-micro text-secondary hover:text-primary sm:inline-flex"
                aria-label="Admin dashboard"
              >
                Admin
              </Link>
            )}

            <Link
              href="/cart"
              aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : "Cart"}
              className={cn(iconClass, "relative")}
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="text-micro absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-medium text-white"
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
