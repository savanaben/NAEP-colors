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

