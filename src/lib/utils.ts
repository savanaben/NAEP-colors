import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Theme = "light" | "beige" | "dark"

export interface HighlightColor {
  name: string
  hex: string
  opacity?: number
}

export const highlightColors: Record<Theme, HighlightColor[]> = {
  light: [
    { name: "Deprecated Highlight", hex: "#FFFFBD" },
    { name: "New Highlight 1", hex: "#FAFF99" },
    { name: "New Highlight 2", hex: "#FCD6BD" },
    { name: "New Highlight 3", hex: "#B7E8E1" },
    { name: "Purple Highlight", hex: "#F3D5FF" },
    { name: "LBB Highlight", hex: "#7DBDFF", opacity: 0.5 },
    { name: "SIP Highlight", hex: "#D1F7D3" },
  ],
  beige: [
    { name: "Deprecated Highlight", hex: "#FFFFBD" },
    { name: "New Highlight 1", hex: "#FAFF99" },
    { name: "New Highlight 2", hex: "#FCD6BD" },
    { name: "New Highlight 3", hex: "#B7E8E1" },
    { name: "Purple Highlight", hex: "#F3D5FF" },
    { name: "LBB Highlight", hex: "#7DBDFF", opacity: 0.5 },
    { name: "SIP Highlight", hex: "#D1F7D3" },
  ],
  dark: [
    { name: "Deprecated Highlight", hex: "#4D4D0B" },
    { name: "New Highlight 1", hex: "#515007" },
    { name: "New Highlight 2", hex: "#723507" },
    { name: "New Highlight 3", hex: "#176055" },
    { name: "Purple Highlight", hex: "#611E80" },
    { name: "LBB Highlight", hex: "#7DBDFF", opacity: 0.5 },
    { name: "SIP Highlight", hex: "#254826" },
  ],
}

export const baseBackgrounds: Record<Theme, string> = {
  light: "#FFFFFF",
  beige: "#F6F6E6",
  dark: "#000000",
}

/** Solid LBB highlight hex per theme (no transparency). Used for "LBB Highlight (Solid)" column. */
export const lbbHighlightSolid: Record<Theme, string> = {
  light: "#BEDEFF",
  beige: "#BADAF3",
  dark: "#3F5F80",
}

// Blend two colors with given opacity
export function blendColor(foreground: string, background: string, opacity: number): string {
  const fg = hexToRgb(foreground)
  const bg = hexToRgb(background)
  
  if (!fg || !bg) return foreground
  
  const r = Math.round(fg.r * opacity + bg.r * (1 - opacity))
  const g = Math.round(fg.g * opacity + bg.g * (1 - opacity))
  const b = Math.round(fg.b * opacity + bg.b * (1 - opacity))
  
  return rgbToHex(r, g, b)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

// Calculate grayscale lightness (0-100) using standard RGB to grayscale conversion
// Uses the standard formula: 0.299*R + 0.587*G + 0.114*B
export function getGrayscaleLightness(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  
  // Convert to grayscale using standard formula
  const gray = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b
  
  // Return as percentage (0-100)
  return Math.round((gray / 255) * 100)
}

// Convert lightness percentage (0-100) to grayscale hex color
export function lightnessToGrayscaleHex(lightness: number): string {
  const gray = Math.round((lightness / 100) * 255)
  return rgbToHex(gray, gray, gray)
}

// Calculate saturation (0-100) from hex color
// Uses the formula: saturation = (max - min) / max
export function getSaturation(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  
  const max = Math.max(rgb.r, rgb.g, rgb.b)
  const min = Math.min(rgb.r, rgb.g, rgb.b)
  
  if (max === 0) return 0
  
  // Calculate saturation as percentage (0-100)
  const saturation = ((max - min) / max) * 100
  return Math.round(saturation)
}


function rgbToHsv(rgb: { r: number; g: number; b: number }): { h: number; s: number; v: number } {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const delta = max - min

  // Hue
  let h = 0
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6
    else if (max === g) h = (b - r) / delta + 2
    else h = (r - g) / delta + 4
    h *= 60
    if (h < 0) h += 360
  }

  // HSV saturation aligns with our getSaturation() metric: (max-min)/max
  const s = max === 0 ? 0 : delta / max
  const v = max

  return { h, s, v }
}

function hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c

  let rp = 0
  let gp = 0
  let bp = 0

  if (h >= 0 && h < 60) {
    rp = c; gp = x; bp = 0
  } else if (h >= 60 && h < 120) {
    rp = x; gp = c; bp = 0
  } else if (h >= 120 && h < 180) {
    rp = 0; gp = c; bp = x
  } else if (h >= 180 && h < 240) {
    rp = 0; gp = x; bp = c
  } else if (h >= 240 && h < 300) {
    rp = x; gp = 0; bp = c
  } else {
    rp = c; gp = 0; bp = x
  }

  return {
    r: Math.round((rp + m) * 255),
    g: Math.round((gp + m) * 255),
    b: Math.round((bp + m) * 255),
  }
}

function hsvToHex(h: number, s: number, v: number): string {
  const rgb = hsvToRgb(h, s, v)
  return rgbToHex(rgb.r, rgb.g, rgb.b)
}

// Reduce saturation to a maximum of `maxSaturation` (as measured by getSaturation / HSV-S),
// while preserving grayscale lightness (within ~2 points when possible).
// For light/beige themes, also ensures minimum lightness of `minLightness` (default 93%).
// For dark theme, only adjusts lightness to `minLightness` (default 12.5%) without changing saturation.
// Neutral colors (Mauve, Slate, Sage, Olive, Sand) get half saturation influence, Gray gets no saturation change.
export function reduceSaturation(hex: string, maxSaturation: number = 12, minLightness: number | null = null, colorName?: string, skipSaturationChange: boolean = false): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  // Determine saturation adjustment factor based on color type
  const neutralColorNames = ["Gray", "Mauve", "Slate", "Sage", "Olive", "Sand"]
  const isGray = colorName === "Gray"
  const isNeutral = !!(colorName && neutralColorNames.includes(colorName))
  const saturationFactor = isGray ? 0 : (isNeutral ? 0.5 : 1) // Gray: no saturation change, other neutrals: half, others: full

  const originalLightness = getGrayscaleLightness(hex)
  const hsv = rgbToHsv(rgb)
  const currentSat = hsv.s * 100

  // If skipping saturation change (dark theme), only adjust lightness
  if (skipSaturationChange) {
    if (minLightness !== null) {
      const currentLightness = getGrayscaleLightness(hex)
      // For dark theme, we want to ensure lightness is AT OR BELOW 12.5%
      // So if current lightness is above target, we need to adjust it
      if (currentLightness > minLightness) {
        // Adjust lightness to target while preserving hue and saturation completely
        // isGray=true means no saturation changes, just adjust V (brightness)
        return adjustLightnessToTarget(hex, minLightness, true, false)
      }
      // If already at or below target, no adjustment needed
    }
    return hex
  }

  // Already at/under cap: check if we still need lightness adjustment
  if (currentSat <= maxSaturation) {
    // If minLightness is specified and current lightness is not at target, adjust it
    if (minLightness !== null) {
      const currentLightness = getGrayscaleLightness(hex)
      if (Math.abs(currentLightness - minLightness) > 0.5) {
        // Adjust lightness to target while preserving hue and saturation
        return adjustLightnessToTarget(hex, minLightness, isGray, isNeutral)
      }
    }
    return hex
  }

  // Calculate target saturation: for neutral colors, apply less reduction
  // If current saturation is above max, we reduce it, but neutrals get less reduction
  const saturationReduction = (currentSat - maxSaturation) * saturationFactor
  const targetS = Math.max(maxSaturation / 100, (currentSat - saturationReduction) / 100)

  // Step 1: reduce saturation (keep V constant to avoid big brightness shifts).
  let bestHex = hsvToHex(hsv.h, targetS, hsv.v)
  let bestDiff = Math.abs(getGrayscaleLightness(bestHex) - originalLightness)

  // Step 2: if grayscale lightness drifted, adjust V to bring it back while keeping H and target S fixed.
  // We accept <= 2 points drift; otherwise binary-search V for closer match.
  if (bestDiff > 2) {
    let lo = 0
    let hi = 1
    let bestV = hsv.v

    const targetLightness = originalLightness

    for (let i = 0; i < 18; i++) {
      const mid = (lo + hi) / 2
      const midHex = hsvToHex(hsv.h, targetS, mid)
      const midLightness = getGrayscaleLightness(midHex)
      const diff = Math.abs(midLightness - targetLightness)

      if (diff < bestDiff) {
        bestDiff = diff
        bestHex = midHex
        bestV = mid
      }

      // If we're too dark, raise V; if too light, lower V.
      if (midLightness < targetLightness) lo = mid
      else hi = mid
    }

    // One more clamp pass in case rounding pushed lightness slightly off.
    bestHex = hsvToHex(hsv.h, targetS, Math.min(1, Math.max(0, bestV)))
  }

  // Step 3: If minLightness is specified, adjust to target lightness
  if (minLightness !== null) {
    const finalLightness = getGrayscaleLightness(bestHex)
    if (Math.abs(finalLightness - minLightness) > 0.5) {
      // Get current HSV after saturation reduction
      const finalRgb = hexToRgb(bestHex)
      if (finalRgb) {
        bestHex = adjustLightnessToTarget(bestHex, minLightness, isGray, isNeutral)
      }
    }
  }

  return bestHex
}

// Adjust color lightness to a target value using iterative saturation/lightness adjustment
// Increases saturation to offset reduced lightness, creating a more vibrant result
// For Gray, no saturation changes are applied. For other neutrals, half saturation influence.
function adjustLightnessToTarget(hex: string, targetLightness: number, isGray: boolean = false, isNeutral: boolean = false): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  let currentHex = hex
  let currentHsv = rgbToHsv(rgb)
  const originalS = currentHsv.s // Preserve original saturation for Gray
  let currentLightness = getGrayscaleLightness(currentHex)
  const maxIterations = 20
  const tolerance = 0.5 // Accept within 0.5% of target
  const saturationFactor = isGray ? 0 : (isNeutral ? 0.5 : 1) // Gray: no change, neutrals: half, others: full

  // If already at target, return early
  if (Math.abs(currentLightness - targetLightness) <= tolerance) {
    return currentHex
  }

  for (let i = 0; i < maxIterations; i++) {
    currentLightness = getGrayscaleLightness(currentHex)
    const diff = currentLightness - targetLightness

    // If we're close enough, stop
    if (Math.abs(diff) <= tolerance) {
      break
    }

    // If too light (above target), reduce lightness
    if (diff > tolerance) {
      // For dark theme (when isGray=true and target is low), be more aggressive
      // Calculate adjustment based on how far off we are
      const adjustmentFactor = targetLightness < 20 ? 0.05 : 0.01 // More aggressive for dark targets
      const vAdjustment = currentHsv.v * adjustmentFactor
      currentHsv.v = Math.max(0, currentHsv.v - vAdjustment)
      
      // Increase saturation by 1-2% to offset the darkening (adjusted by factor)
      // But skip if isGray=true (dark theme mode where we preserve saturation)
      if (!isGray) {
        const sIncrease = Math.min(0.02, 1 - currentHsv.s) * saturationFactor // Cap at 100% saturation, apply factor
        currentHsv.s = Math.min(1, currentHsv.s + sIncrease)
      } else {
        // For Gray or dark theme (skipSaturationChange), keep original saturation
        currentHsv.s = originalS
      }
    } 
    // If too dark (below target), we need to lighten
    else if (diff < -tolerance) {
      // Increase V slightly
      const vAdjustment = (1 - currentHsv.v) * 0.01
      currentHsv.v = Math.min(1, currentHsv.v + vAdjustment)
      
      // Slightly reduce saturation if we're getting too light (adjusted by factor)
      if (!isGray && currentHsv.s > 0.01) {
        const sDecrease = 0.005 * saturationFactor
        currentHsv.s = Math.max(0, currentHsv.s - sDecrease)
      } else if (isGray) {
        // For Gray, keep original saturation
        currentHsv.s = originalS
      }
    }

    // Generate new color with adjusted HSV
    currentHex = hsvToHex(currentHsv.h, currentHsv.s, currentHsv.v)
    
    // Update HSV for next iteration
    const newRgb = hexToRgb(currentHex)
    if (newRgb) {
      currentHsv = rgbToHsv(newRgb)
      if (isGray) {
        // Preserve original saturation for Gray
        currentHsv.s = originalS
      }
    } else {
      break
    }
  }

  return currentHex
}

