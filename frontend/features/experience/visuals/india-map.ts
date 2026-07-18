/** Simplified India silhouette for the craft clusters map (viewBox 0 0 100 120). */
export const INDIA_MAP_PATH =
  "M 36 13 C 44 8, 56 7, 66 10 C 76 13, 83 20, 84 29 L 85 37 C 86 45, 84 53, 81 60 L 77 68 C 73 76, 68 84, 62 91 L 56 99 C 52 105, 49 111, 47 116 L 45 114 C 43 108, 41 101, 39 94 L 35 84 C 31 74, 28 64, 27 54 L 26 44 C 25 34, 29 24, 34 17 L 36 13 Z";

/** Western Gujarat peninsula accent. */
export const GUJARAT_PATH =
  "M 26 44 C 20 46, 16 50, 15 56 C 14 61, 17 64, 21 61 L 24 55 L 26 48 Z";

/** Golden thread routes linking craft hubs. */
export const CLUSTER_ROUTES: [string, string][] = [
  ["banarasi", "chanderi"],
  ["chanderi", "maheshwari"],
  ["chanderi", "kanjeevaram"],
  ["banarasi", "kanjeevaram"],
];

export function clusterRoutePath(
  from: { x: number; y: number },
  to: { x: number; y: number }
): string {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2 - 6;
  return `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`;
}
