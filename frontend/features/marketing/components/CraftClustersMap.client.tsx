"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CRAFT_PAGE } from "@/content/site-pages";
import { Container } from "@/components/ui/Container";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import {
  CLUSTER_ROUTES,
  clusterRoutePath,
  GUJARAT_PATH,
  INDIA_MAP_PATH,
} from "@/features/experience/visuals/india-map";
import { cn } from "@/lib/utils";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

type Cluster = (typeof CRAFT_PAGE.clusters)[number];

function MapMarker({
  cluster,
  index,
  active,
  reduced,
  onEnter,
}: {
  cluster: Cluster;
  index: number;
  active: boolean;
  reduced: boolean;
  onEnter: () => void;
}) {
  const { x, y } = cluster;

  return (
    <g
      className="cursor-pointer"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      role="button"
      tabIndex={0}
      aria-label={`${cluster.weave} — ${cluster.region}`}
    >
      <g transform={`translate(${x}, ${y})`}>
        {!reduced && (
          <>
            <motion.circle
              r={10}
              fill="none"
              stroke="#c9a962"
              strokeWidth={0.35}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{
                scale: active ? [1, 1.6, 1] : [1, 1.35, 1],
                opacity: active ? [0.5, 0, 0.5] : [0.35, 0, 0.35],
              }}
              transition={{
                duration: active ? 2 : 3,
                repeat: Infinity,
                delay: index * 0.35,
                ease: "easeInOut",
              }}
            />
            <motion.circle
              r={6}
              fill="none"
              stroke="#c9a962"
              strokeWidth={0.25}
              animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.05, 0.25] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 + 0.5 }}
            />
          </>
        )}

        <motion.circle
          r={active ? 3.8 : 3}
          fill={active ? "#c9a962" : "#6b2d3c"}
          stroke="#f5e6c8"
          strokeWidth={0.6}
          animate={{ scale: active ? 1.2 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        />

        <circle r={1.2} fill="#f5e6c8" opacity={active ? 1 : 0.7} />
      </g>

      <AnimatePresence>
        {active && (
          <motion.g
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.25 }}
          >
            <rect
              x={x - 14}
              y={y - 18}
              width={28}
              height={8}
              rx={1}
              fill="#0d0a09"
              fillOpacity={0.85}
            />
            <text
              x={x}
              y={y - 12.5}
              textAnchor="middle"
              className="fill-secondary text-[3.5px] font-medium uppercase tracking-[0.2em]"
              style={{ fontFamily: "inherit" }}
            >
              {cluster.weave}
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </g>
  );
}

export function CraftClustersMap() {
  const { fadeInView } = useInViewMotion();
  const { clusters } = CRAFT_PAGE;
  const { reduced } = useExperienceMotion();
  const [activeSlug, setActiveSlug] = useState<string>(clusters[0].slug);

  const clusterBySlug = useMemo(
    () => Object.fromEntries(clusters.map((c) => [c.slug, c])),
    [clusters]
  );

  const routes = useMemo(
    () =>
      CLUSTER_ROUTES.map(([from, to]) => {
        const a = clusterBySlug[from];
        const b = clusterBySlug[to];
        if (!a || !b) return null;
        return { id: `${from}-${to}`, d: clusterRoutePath(a, b), from, to };
      }).filter(Boolean) as { id: string; d: string; from: string; to: string }[],
    [clusterBySlug]
  );

  const activeCluster = clusterBySlug[activeSlug] ?? clusters[0];

  return (
    <section className="experience-section relative overflow-hidden border-t border-border bg-background-alt py-24 md:py-28">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.04]" />

      <Container>
        <motion.div
          {...fadeInView({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
          className="mb-14 text-center"
        >
          <p className="text-eyebrow text-secondary">Craft clusters</p>
          <h2 className="text-chapter mt-3 text-ink">Where we weave</h2>
          <p className="mx-auto mt-4 max-w-xl text-text-muted leading-relaxed">
            Four regions, four living traditions — traced across the subcontinent like threads on a
            master loom.
          </p>
        </motion.div>

        <div className="grid items-stretch gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          {/* Map panel */}
          <motion.div
            {...fadeInView({ opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1 })}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-sm border border-secondary/25 bg-ink shadow-[var(--shadow-soft)]"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(201,169,98,0.12),transparent_65%)]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />

            <div className="relative aspect-[4/5] w-full p-6 sm:p-8 md:aspect-square md:p-10">
              <svg
                viewBox="0 0 100 120"
                className="h-full w-full"
                aria-label="Map of India showing AADIORA craft cluster locations"
                role="img"
              >
                <defs>
                  <linearGradient id="landFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6b2d3c" stopOpacity="0.35" />
                    <stop offset="50%" stopColor="#3d1a22" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#1a1410" stopOpacity="0.15" />
                  </linearGradient>
                  <linearGradient id="landStroke" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#c9a962" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#c9a962" stopOpacity="0.35" />
                  </linearGradient>
                  <filter id="markerGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="1.2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Decorative latitude lines */}
                {[32, 48, 64, 80].map((y) => (
                  <line
                    key={y}
                    x1={22}
                    y1={y}
                    x2={86}
                    y2={y}
                    stroke="#c9a962"
                    strokeWidth={0.15}
                    strokeOpacity={0.12}
                    strokeDasharray="1 2"
                  />
                ))}

                {/* Landmass */}
                <motion.path
                  d={INDIA_MAP_PATH}
                  fill="url(#landFill)"
                  stroke="url(#landStroke)"
                  strokeWidth={0.55}
                  strokeLinejoin="round"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.path
                  d={GUJARAT_PATH}
                  fill="url(#landFill)"
                  stroke="url(#landStroke)"
                  strokeWidth={0.4}
                  strokeLinejoin="round"
                  initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Golden thread routes */}
                {routes.map((route, i) => {
                  const isActive =
                    activeSlug === route.from || activeSlug === route.to;
                  return (
                    <motion.path
                      key={route.id}
                      d={route.d}
                      fill="none"
                      stroke="#c9a962"
                      strokeWidth={isActive ? 0.45 : 0.25}
                      strokeOpacity={isActive ? 0.75 : 0.28}
                      strokeLinecap="round"
                      strokeDasharray="2 2"
                      className={reduced ? undefined : "craft-map-thread"}
                      style={{ animationDelay: `${i * 0.5}s` }}
                      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.4 + i * 0.15, ease: "easeOut" }}
                    />
                  );
                })}

                {/* Markers */}
                <g filter="url(#markerGlow)">
                  {clusters.map((cluster, i) => (
                    <MapMarker
                      key={cluster.slug}
                      cluster={cluster}
                      index={i}
                      active={activeSlug === cluster.slug}
                      reduced={reduced}
                      onEnter={() => setActiveSlug(cluster.slug)}
                    />
                  ))}
                </g>
              </svg>

              <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-end justify-between text-eyebrow text-white/35">
                <span>West</span>
                <span className="text-secondary/60">Craft atlas</span>
                <span>East</span>
              </div>
            </div>
          </motion.div>

          {/* Cluster cards */}
          <div className="flex flex-col gap-3">
            {clusters.map((cluster, i) => {
              const isActive = activeSlug === cluster.slug;
              return (
                <motion.div
                  key={cluster.slug}
                  {...fadeInView({ opacity: 0, x: 24 }, { opacity: 1, x: 0 })}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onMouseEnter={() => setActiveSlug(cluster.slug)}
                >
                  <Link
                    href={`/collections/${cluster.slug}`}
                    className={cn(
                      "group relative block overflow-hidden border bg-surface p-6 transition-all duration-500 md:p-7",
                      isActive
                        ? "border-secondary shadow-[var(--shadow-soft)]"
                        : "border-border hover:border-secondary/50"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute left-0 top-0 h-full w-1 bg-secondary transition-all duration-500",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      )}
                    />
                    <div
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-gradient-to-r from-secondary/8 to-transparent transition-opacity duration-500",
                        isActive ? "opacity-100" : "opacity-0"
                      )}
                    />

                    <div className="relative flex items-start gap-5">
                      <span
                        className={cn(
                          "text-stat leading-none transition-colors duration-500",
                          isActive ? "text-secondary" : "text-text-muted/40"
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-eyebrow text-text-muted">
                          {cluster.region}
                        </p>
                        <h3
                          className={cn(
                            "text-card-title-lg mt-1 transition-colors duration-300",
                            isActive ? "text-primary" : "text-ink group-hover:text-primary"
                          )}
                        >
                          {cluster.weave}
                        </h3>
                        <p className="mt-1 text-small text-secondary">{cluster.name}</p>
                        <p className="mt-3 text-small text-text-muted leading-relaxed">
                          {cluster.craft}
                        </p>
                        <span
                          className={cn(
                            "mt-4 inline-flex items-center gap-2 text-eyebrow transition-all duration-300",
                            isActive
                              ? "text-primary"
                              : "text-text-muted group-hover:text-primary"
                          )}
                        >
                          Explore collection
                          <span
                            className={cn(
                              "transition-transform duration-300",
                              isActive ? "translate-x-1" : "group-hover:translate-x-1"
                            )}
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            {/* Active cluster highlight strip */}
            <motion.div
              layout
              className="mt-2 border border-secondary/30 bg-ink px-6 py-5 text-center"
              key={activeCluster.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-eyebrow text-secondary">Now viewing</p>
              <p className="mt-2 text-title text-white">
                {activeCluster.weave}
                <span className="text-white/40"> · </span>
                {activeCluster.region}
              </p>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
