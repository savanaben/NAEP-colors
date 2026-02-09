import type { Theme } from "./utils"

export type RadixColorSystem = "radix11_3" | "radix11_4"

/** Radix 11/3 light-theme only: original hex → override hex (yellow, amber, orange, jade, teal) */
const RADIX_LIGHT_OVERRIDE_MAP: Record<string, string> = {
  "#9e6c00": "#9A6900", // yellow
  "#ab6400": "#A76200", // amber
  "#cc4e00": "#C54B00", // orange
  "#208368": "#1F8166", // jade
  "#008573": "#008170", // teal
}

function normalizeHex(hex: string): string {
  const s = hex.startsWith("#") ? hex.slice(1) : hex
  return "#" + s.toLowerCase()
}

/**
 * When override is on, theme is light/beige, and color system is Radix 11/3 or 11/4,
 * returns the overridden hex for the 5 adjusted colors; otherwise returns the original hex.
 */
export function applyRadixLightOverride(
  hex: string,
  theme: Theme,
  colorSystem: string,
  overrideOn: boolean
): string {
  if (!overrideOn || (theme !== "light" && theme !== "beige")) return hex
  if (colorSystem !== "radix11_3" && colorSystem !== "radix11_4") return hex
  const key = normalizeHex(hex)
  return RADIX_LIGHT_OVERRIDE_MAP[key] ?? hex
}
