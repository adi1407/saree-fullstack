import { WEAVES, OCCASIONS } from "@/lib/types";

export interface NavLink {
  href: string;
  label: string;
  description?: string;
}

export interface NavMegaColumn {
  title: string;
  links: NavLink[];
}

export interface NavMegaFeatured {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  gradient: string;
}

export interface NavMegaMenu {
  id: string;
  label: string;
  href?: string;
  columns: NavMegaColumn[];
  featured?: NavMegaFeatured;
}

export const SHOP_MEGA: NavMegaMenu = {
  id: "shop",
  label: "Shop",
  href: "/sarees",
  columns: [
    {
      title: "Catalog",
      links: [
        { href: "/sarees", label: "All Sarees", description: "Full handloom collection" },
        { href: "/sarees?sort=newest", label: "New Arrivals", description: "Fresh from the loom" },
        { href: "/sarees?sort=newest&newArrival=true", label: "This Fortnight", description: "Limited new edits" },
      ],
    },
    {
      title: "By Weave",
      links: WEAVES.map((w) => ({
        href: `/collections/${w.slug}`,
        label: w.label,
        description: w.region,
      })),
    },
    {
      title: "By Occasion",
      links: [
        ...OCCASIONS.map((o) => ({
          href: `/occasions/${o.slug}`,
          label: o.label,
          description: o.description,
        })),
        {
          href: "/occasions/casual",
          label: "Casual",
          description: "Effortless everyday grace",
        },
      ],
    },
  ],
  featured: {
    href: "/collections/banarasi",
    eyebrow: "Featured weave",
    title: "The Banarasi Edit",
    description: "Kadhua brocade & real zari from Varanasi",
    gradient: "linear-gradient(145deg, #6b2d3c 0%, #1a1410 55%, #c9a962 120%)",
  },
};

export const DISCOVER_MEGA: NavMegaMenu = {
  id: "discover",
  label: "Discover",
  columns: [
    {
      title: "The House",
      links: [
        { href: "/about", label: "Our Story", description: "Philosophy & heritage" },
        { href: "/our-craft", label: "Our Craft", description: "From loom to drape" },
        { href: "/artisans", label: "Artisans", description: "Meet the weavers" },
        { href: "/sustainability", label: "Sustainability", description: "Impact & ethics" },
      ],
    },
    {
      title: "Editorial",
      links: [
        { href: "/lookbook", label: "Lookbook", description: "Styled for every moment" },
        { href: "/journal", label: "Journal", description: "Stories from the loom" },
        { href: "/edits/new-arrivals", label: "What's New", description: "Latest campaign edit" },
        { href: "/regions/varanasi", label: "Craft Regions", description: "Cluster stories" },
      ],
    },
    {
      title: "Services",
      links: [
        { href: "/bridal", label: "Bridal", description: "Wedding atelier" },
        { href: "/stores", label: "Stores", description: "Visit a boutique" },
        { href: "/appointments", label: "Appointments", description: "Book a stylist" },
        { href: "/authenticity", label: "Authenticity", description: "Handloom provenance" },
      ],
    },
  ],
  featured: {
    href: "/bridal",
    eyebrow: "Weddings",
    title: "The Bridal Atelier",
    description: "Curated mandap & reception edits",
    gradient: "linear-gradient(160deg, #1a1410 0%, #6b2d3c 50%, #2d5c4e 100%)",
  },
};

export const PRIMARY_NAV_LINKS: NavLink[] = [
  { href: "/bridal", label: "Bridal" },
];

export const MOBILE_SHOP_LINKS: NavLink[] = [
  { href: "/sarees", label: "All Sarees" },
  ...WEAVES.slice(0, 4).map((w) => ({ href: `/collections/${w.slug}`, label: w.label })),
  { href: "/sarees?sort=newest", label: "New Arrivals" },
];

export const MOBILE_DISCOVER_LINKS: NavLink[] = [
  { href: "/about", label: "Our Story" },
  { href: "/our-craft", label: "Our Craft" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/journal", label: "Journal" },
  { href: "/edits/new-arrivals", label: "What's New" },
  { href: "/bridal", label: "Bridal" },
  { href: "/occasions/wedding", label: "Occasions" },
  { href: "/regions/varanasi", label: "Craft Regions" },
  { href: "/stores", label: "Stores" },
  { href: "/artisans", label: "Artisans" },
  { href: "/sustainability", label: "Sustainability" },
];

export const MOBILE_HELP_LINKS: NavLink[] = [
  { href: "/faq", label: "FAQ" },
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns" },
  { href: "/appointments", label: "Appointments" },
  { href: "/authenticity", label: "Authenticity" },
  { href: "/care-guide", label: "Care Guide" },
  { href: "/contact", label: "Contact" },
];

export const DESKTOP_MEGA_MENUS = [SHOP_MEGA, DISCOVER_MEGA];

export function isNavPathActive(pathname: string, href: string): boolean {
  const base = href.split("?")[0];
  if (base === "/") return pathname === "/";
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function isMegaMenuActive(pathname: string, menu: NavMegaMenu): boolean {
  if (menu.href && isNavPathActive(pathname, menu.href)) return true;
  return menu.columns.some((col) =>
    col.links.some((link) => isNavPathActive(pathname, link.href))
  );
}
