"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import {
  SHOP_MEGA,
  DISCOVER_MEGA,
  type NavMegaMenu,
  isMegaMenuActive,
  isNavPathActive,
} from "@/content/navigation";
import { cn } from "@/lib/utils";

const MEGA_MENUS = [SHOP_MEGA, DISCOVER_MEGA];
const CLOSE_DELAY_MS = 140;

interface NavMegaMenuPanelProps {
  menu: NavMegaMenu;
  onClose: () => void;
}

function NavMegaMenuPanel({ menu, onClose }: NavMegaMenuPanelProps) {
  const pathname = usePathname();

  return (
    <div className="border-b border-border bg-surface/98 shadow-[var(--shadow-soft)] backdrop-blur-xl">
      <div className="mx-auto grid max-w-[1440px] px-4 md:px-6 lg:grid-cols-[1fr_1fr_1fr_minmax(11rem,14rem)] lg:px-8">
        {menu.columns.map((column, i) => (
          <div
            key={column.title}
            className={cn(
              "py-6 lg:border-r lg:py-8 lg:pr-6",
              i < menu.columns.length - 1 || menu.featured ? "border-border lg:border-r" : "",
              i > 0 && "lg:pl-6"
            )}
          >
            <p className="text-eyebrow mb-4 text-text-muted">{column.title}</p>
            <ul className="space-y-0.5">
              {column.links.map((link) => {
                const active = isNavPathActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      role="menuitem"
                      onClick={onClose}
                      className={cn(
                        "group block rounded-sm px-2 py-2.5 transition-colors",
                        active ? "bg-background-alt" : "hover:bg-background-alt"
                      )}
                    >
                      <span
                        className={cn(
                          "text-small font-medium",
                          active ? "text-primary" : "text-ink group-hover:text-primary"
                        )}
                      >
                        {link.label}
                      </span>
                      {link.description && (
                        <span className="text-small mt-0.5 block text-text-muted">
                          {link.description}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        {menu.featured && (
          <Link
            href={menu.featured.href}
            onClick={onClose}
            className="group relative flex min-h-[10rem] flex-col justify-end overflow-hidden py-6 lg:min-h-[18rem] lg:py-8 lg:pl-6"
            style={{ background: menu.featured.gradient }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/25 to-transparent" />
            <div className="relative">
              <p className="text-eyebrow text-secondary">{menu.featured.eyebrow}</p>
              <p className="text-card-title mt-2 text-white">{menu.featured.title}</p>
              <p className="text-small mt-2 max-w-xs text-white/65">{menu.featured.description}</p>
              <span className="text-micro mt-4 inline-block text-secondary transition-transform group-hover:translate-x-1">
                Explore →
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export function NavMegaMenuHost({
  activeMenu,
  onClose,
}: {
  activeMenu: string | null;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const menu = MEGA_MENUS.find((m) => m.id === activeMenu);

  return (
    <div className="absolute left-1/2 top-full z-50 w-screen -translate-x-1/2">
      <AnimatePresence>
        {menu && (
          <motion.div
            key={menu.id}
            role="menu"
            aria-label={`${menu.label} menu`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduced ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <NavMegaMenuPanel menu={menu} onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DesktopNavProps {
  activeMenu: string | null;
  onMenuChange: (id: string | null) => void;
  onZoneEnter?: () => void;
  onZoneLeave?: () => void;
}

export function DesktopNav({
  activeMenu,
  onMenuChange,
  onZoneEnter,
  onZoneLeave,
}: DesktopNavProps) {
  const pathname = usePathname();
  const close = useCallback(() => onMenuChange(null), [onMenuChange]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  const handleTriggerEnter = (menuId: string) => {
    onZoneEnter?.();
    onMenuChange(menuId);
  };

  return (
    <div className="relative" onMouseEnter={onZoneEnter} onMouseLeave={onZoneLeave}>
      <nav className="flex items-center gap-5">
        {MEGA_MENUS.map((menu) => {
          const open = activeMenu === menu.id;
          const isActive = isMegaMenuActive(pathname, menu);
          const lit = open || isActive;

          return (
            <div key={menu.id} className="relative">
              <button
                type="button"
                aria-expanded={open}
                aria-haspopup="true"
                onMouseEnter={() => handleTriggerEnter(menu.id)}
                onFocus={() => handleTriggerEnter(menu.id)}
                onClick={() => onMenuChange(open ? null : menu.id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-1 py-2 text-eyebrow transition-colors",
                  lit ? "text-primary" : "text-text-muted hover:text-primary"
                )}
              >
                {menu.label}
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-300",
                    open && "rotate-180"
                  )}
                />
                <span
                  aria-hidden
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-secondary transition-transform duration-300",
                    lit ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            </div>
          );
        })}

        <Link
          href="/bridal"
          className={cn(
            "relative px-1 py-2 text-eyebrow transition-colors",
            isNavPathActive(pathname, "/bridal")
              ? "text-primary"
              : "text-text-muted hover:text-primary"
          )}
        >
          Bridal
          <span
            aria-hidden
            className={cn(
              "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-secondary transition-transform duration-300",
              isNavPathActive(pathname, "/bridal") ? "scale-x-100" : "scale-x-0"
            )}
          />
        </Link>
      </nav>

      <NavMegaMenuHost activeMenu={activeMenu} onClose={close} />
    </div>
  );
}

export { CLOSE_DELAY_MS };
