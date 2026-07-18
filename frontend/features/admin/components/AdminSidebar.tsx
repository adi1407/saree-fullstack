"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Plus,
  Store,
  LogOut,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Sheet } from "@/components/ui/Sheet.client";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/sarees", label: "All Sarees", icon: Package },
  { href: "/admin/sarees/new", label: "Add Saree", icon: Plus },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
];

function NavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav className={cn("space-y-1", className)}>
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href || (href !== "/admin" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-sm px-3 py-2.5 text-small transition-colors",
              active
                ? "bg-white/10 text-secondary"
                : "text-white/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();

  async function logout() {
    await apiClient.post("/api/auth/logout");
    router.push("/login");
  }

  return (
    <div className="space-y-1 border-t border-white/10 pt-3">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex min-h-11 items-center gap-3 rounded-sm px-3 py-2.5 text-small text-white/70 hover:bg-white/5 hover:text-white"
      >
        <Store className="h-4 w-4" />
        View Store
      </Link>
      <button
        type="button"
        onClick={logout}
        className="flex min-h-11 w-full items-center gap-3 rounded-sm px-3 py-2.5 text-small text-white/70 hover:bg-white/5 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  );
}

function currentPageLabel(pathname: string) {
  const match = links.find(
    (l) => pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href))
  );
  return match?.label ?? "Admin";
}

export function AdminMobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-white/10 bg-ink px-4 py-3 md:hidden">
        <div className="min-w-0 flex-1">
          <BrandLogo href="/admin" variant="admin" />
          <p className="mt-1 truncate text-eyebrow text-secondary">
            {currentPageLabel(pathname)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="touch-target shrink-0 rounded-sm border border-white/15 text-white/80 hover:border-secondary hover:text-secondary"
          aria-label="Open admin sidebar"
          aria-expanded={open}
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        side="left"
        variant="dark"
        showHeader={false}
      >
        <div className="-mx-1 flex min-h-full flex-col">
          <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-5">
            <div>
              <BrandLogo href="/admin" variant="admin" onNavigate={() => setOpen(false)} />
              <p className="mt-2 text-eyebrow text-secondary">Admin</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="touch-target text-white/60 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} className="flex-1" />

          <SidebarFooter onNavigate={() => setOpen(false)} />
        </div>
      </Sheet>
    </>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-56 shrink-0 flex-col bg-ink text-white md:flex">
      <div className="border-b border-white/10 p-4">
        <BrandLogo href="/admin" variant="admin" />
        <p className="mt-2 text-eyebrow text-secondary">Admin</p>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <NavLinks pathname={pathname} className="flex-1" />
        <SidebarFooter />
      </div>
    </aside>
  );
}
