import Image from "next/image";
import Link from "next/link";
import {
  BRAND_LOGO_ALT,
  BRAND_LOGO_DIMENSIONS,
  BRAND_LOGO_ICON_SRC,
  BRAND_LOGO_SRC,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLogoVariant = "navbar" | "footer" | "auth" | "admin" | "default";

interface BrandLogoProps {
  href?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onNavigate?: () => void;
  variant?: BrandLogoVariant;
  /** Light text on dark / transparent header */
  inverted?: boolean;
}

function NavbarLockup({
  priority,
  imageClassName,
  onDark = false,
}: {
  priority?: boolean;
  imageClassName?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", imageClassName)}>
      <Image
        src={BRAND_LOGO_ICON_SRC}
        alt=""
        width={BRAND_LOGO_DIMENSIONS.icon.width}
        height={BRAND_LOGO_DIMENSIONS.icon.height}
        priority={priority}
        aria-hidden
        className="h-9 w-9 shrink-0 object-contain drop-shadow-sm sm:h-10 sm:w-10"
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={cn(
            "text-logo",
            onDark
              ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
              : "text-ink"
          )}
        >
          {BRAND_NAME}
        </span>
        <span
          className={cn(
            "text-logo-tagline mt-1",
            onDark
              ? "text-secondary drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              : "text-text-muted"
          )}
        >
          {BRAND_TAGLINE}
        </span>
      </span>
    </span>
  );
}

const imageVariants: Record<
  Exclude<BrandLogoVariant, "navbar" | "admin">,
  { src: string; width: number; height: number; image: string; wrap?: string }
> = {
  footer: {
    src: BRAND_LOGO_SRC,
    width: BRAND_LOGO_DIMENSIONS.full.width,
    height: BRAND_LOGO_DIMENSIONS.full.height,
    image: "h-[76px] w-auto",
  },
  auth: {
    src: BRAND_LOGO_SRC,
    width: BRAND_LOGO_DIMENSIONS.full.width,
    height: BRAND_LOGO_DIMENSIONS.full.height,
    image: "h-28 w-auto sm:h-32",
  },
  default: {
    src: BRAND_LOGO_SRC,
    width: BRAND_LOGO_DIMENSIONS.full.width,
    height: BRAND_LOGO_DIMENSIONS.full.height,
    image: "h-14 w-auto md:h-16",
  },
};

export function BrandLogo({
  href = "/",
  className,
  imageClassName,
  priority = false,
  onNavigate,
  variant = "default",
  inverted = false,
}: BrandLogoProps) {
  let content: React.ReactNode;

  if (variant === "navbar" || variant === "admin") {
    content = (
      <NavbarLockup
        priority={priority}
        imageClassName={imageClassName}
        onDark={variant === "admin" || inverted}
      />
    );
  } else {
    const config = imageVariants[variant];
    content = (
      <span className={cn("inline-flex items-center", config.wrap)}>
        <Image
          src={config.src}
          alt={BRAND_LOGO_ALT}
          width={config.width}
          height={config.height}
          priority={priority}
          className={cn("object-contain", config.image, imageClassName)}
        />
      </span>
    );
  }

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={`${BRAND_NAME} home`}
      className={cn(
        "relative inline-flex shrink-0 items-center",
        variant === "navbar" ? "z-0" : "z-10",
        className
      )}
    >
      {content}
    </Link>
  );
}
