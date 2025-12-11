// Tailwind CSS colors (various levels, suitable for text)
export interface TailwindColor {
  name: string
  hex: string
}

export function getAllTailwind700Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#334155" },
    { name: "Gray", hex: "#374151" },
    { name: "Zinc", hex: "#3f3f46" },
    { name: "Neutral", hex: "#404040" },
    { name: "Stone", hex: "#44403c" },
    { name: "Red", hex: "#b91c1c" },
    { name: "Orange", hex: "#c2410c" },
    { name: "Amber", hex: "#b45309" },
    { name: "Yellow", hex: "#a16207" },
    { name: "Lime", hex: "#4d7c0f" },
    { name: "Green", hex: "#15803d" },
    { name: "Emerald", hex: "#047857" },
    { name: "Teal", hex: "#0f766e" },
    { name: "Cyan", hex: "#0e7490" },
    { name: "Sky", hex: "#0369a1" },
    { name: "Blue", hex: "#1d4ed8" },
    { name: "Indigo", hex: "#4338ca" },
    { name: "Violet", hex: "#6d28d9" },
    { name: "Purple", hex: "#7c3aed" },
    { name: "Fuchsia", hex: "#a21caf" },
    { name: "Pink", hex: "#be185d" },
    { name: "Rose", hex: "#be123c" },
  ]
}

export function getAllTailwind800Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#1e293b" },
    { name: "Gray", hex: "#1f2937" },
    { name: "Zinc", hex: "#27272a" },
    { name: "Neutral", hex: "#262626" },
    { name: "Stone", hex: "#292524" },
    { name: "Red", hex: "#991b1b" },
    { name: "Orange", hex: "#9a3412" },
    { name: "Amber", hex: "#92400e" },
    { name: "Yellow", hex: "#854d0e" },
    { name: "Lime", hex: "#3f6212" },
    { name: "Green", hex: "#166534" },
    { name: "Emerald", hex: "#065f46" },
    { name: "Teal", hex: "#155e75" },
    { name: "Cyan", hex: "#155e75" },
    { name: "Sky", hex: "#075985" },
    { name: "Blue", hex: "#1e40af" },
    { name: "Indigo", hex: "#3730a3" },
    { name: "Violet", hex: "#5b21b6" },
    { name: "Purple", hex: "#6b21a8" },
    { name: "Fuchsia", hex: "#86198f" },
    { name: "Pink", hex: "#9f1239" },
    { name: "Rose", hex: "#9f1239" },
  ]
}

export function getAllTailwind200Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#e2e8f0" },
    { name: "Gray", hex: "#e5e7eb" },
    { name: "Zinc", hex: "#e4e4e7" },
    { name: "Neutral", hex: "#e5e5e5" },
    { name: "Stone", hex: "#e7e5e4" },
    { name: "Red", hex: "#fecaca" },
    { name: "Orange", hex: "#fed7aa" },
    { name: "Amber", hex: "#fde68a" },
    { name: "Yellow", hex: "#fef08a" },
    { name: "Lime", hex: "#d9f99d" },
    { name: "Green", hex: "#bbf7d0" },
    { name: "Emerald", hex: "#a7f3d0" },
    { name: "Teal", hex: "#99f6e4" },
    { name: "Cyan", hex: "#a5f3fc" },
    { name: "Sky", hex: "#bae6fd" },
    { name: "Blue", hex: "#bfdbfe" },
    { name: "Indigo", hex: "#c7d2fe" },
    { name: "Violet", hex: "#ddd6fe" },
    { name: "Purple", hex: "#e9d5ff" },
    { name: "Fuchsia", hex: "#f5d0fe" },
    { name: "Pink", hex: "#fce7f3" },
    { name: "Rose", hex: "#fecdd3" },
  ]
}

export function getAllTailwind100Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#f1f5f9" },
    { name: "Gray", hex: "#f3f4f6" },
    { name: "Zinc", hex: "#f4f4f5" },
    { name: "Neutral", hex: "#f5f5f5" },
    { name: "Stone", hex: "#f5f5f4" },
    { name: "Red", hex: "#fee2e2" },
    { name: "Orange", hex: "#ffedd5" },
    { name: "Amber", hex: "#fef3c7" },
    { name: "Yellow", hex: "#fef9c3" },
    { name: "Lime", hex: "#ecfccb" },
    { name: "Green", hex: "#dcfce7" },
    { name: "Emerald", hex: "#d1fae5" },
    { name: "Teal", hex: "#ccfbf1" },
    { name: "Cyan", hex: "#cffafe" },
    { name: "Sky", hex: "#e0f2fe" },
    { name: "Blue", hex: "#dbeafe" },
    { name: "Indigo", hex: "#e0e7ff" },
    { name: "Violet", hex: "#ede9fe" },
    { name: "Purple", hex: "#f3e8ff" },
    { name: "Fuchsia", hex: "#fae8ff" },
    { name: "Pink", hex: "#fce7f3" },
    { name: "Rose", hex: "#ffe4e6" },
  ]
}

export function getAllTailwind300Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#cbd5e1" },
    { name: "Gray", hex: "#d1d5db" },
    { name: "Zinc", hex: "#d4d4d8" },
    { name: "Neutral", hex: "#d4d4d4" },
    { name: "Stone", hex: "#d6d3d1" },
    { name: "Red", hex: "#fca5a5" },
    { name: "Orange", hex: "#fdba74" },
    { name: "Amber", hex: "#fcd34d" },
    { name: "Yellow", hex: "#fde047" },
    { name: "Lime", hex: "#bef264" },
    { name: "Green", hex: "#86efac" },
    { name: "Emerald", hex: "#6ee7b7" },
    { name: "Teal", hex: "#5eead4" },
    { name: "Cyan", hex: "#67e8f9" },
    { name: "Sky", hex: "#7dd3fc" },
    { name: "Blue", hex: "#93c5fd" },
    { name: "Indigo", hex: "#a5b4fc" },
    { name: "Violet", hex: "#c4b5fd" },
    { name: "Purple", hex: "#c084fc" },
    { name: "Fuchsia", hex: "#f0abfc" },
    { name: "Pink", hex: "#f9a8d4" },
    { name: "Rose", hex: "#fda4af" },
  ]
}

export function getAllTailwind50Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#f8fafc" },
    { name: "Gray", hex: "#f9fafb" },
    { name: "Zinc", hex: "#fafafa" },
    { name: "Neutral", hex: "#fafafa" },
    { name: "Stone", hex: "#fafaf9" },
    { name: "Red", hex: "#fef2f2" },
    { name: "Orange", hex: "#fff7ed" },
    { name: "Amber", hex: "#fffbeb" },
    { name: "Yellow", hex: "#fefce8" },
    { name: "Lime", hex: "#f7fee7" },
    { name: "Green", hex: "#f0fdf4" },
    { name: "Emerald", hex: "#ecfdf5" },
    { name: "Teal", hex: "#f0fdfa" },
    { name: "Cyan", hex: "#ecfeff" },
    { name: "Sky", hex: "#f0f9ff" },
    { name: "Blue", hex: "#eff6ff" },
    { name: "Indigo", hex: "#eef2ff" },
    { name: "Violet", hex: "#f5f3ff" },
    { name: "Purple", hex: "#faf5ff" },
    { name: "Fuchsia", hex: "#fdf4ff" },
    { name: "Pink", hex: "#fdf2f8" },
    { name: "Rose", hex: "#fff1f2" },
  ]
}

export function getAllTailwind900Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#0f172a" },
    { name: "Gray", hex: "#111827" },
    { name: "Zinc", hex: "#18181b" },
    { name: "Neutral", hex: "#171717" },
    { name: "Stone", hex: "#1c1917" },
    { name: "Red", hex: "#7f1d1d" },
    { name: "Orange", hex: "#7c2d12" },
    { name: "Amber", hex: "#78350f" },
    { name: "Yellow", hex: "#713f12" },
    { name: "Lime", hex: "#365314" },
    { name: "Green", hex: "#14532d" },
    { name: "Emerald", hex: "#064e3b" },
    { name: "Teal", hex: "#134e4a" },
    { name: "Cyan", hex: "#164e63" },
    { name: "Sky", hex: "#0c4a6e" },
    { name: "Blue", hex: "#1e3a8a" },
    { name: "Indigo", hex: "#312e81" },
    { name: "Violet", hex: "#4c1d95" },
    { name: "Purple", hex: "#581c87" },
    { name: "Fuchsia", hex: "#701a75" },
    { name: "Pink", hex: "#831843" },
    { name: "Rose", hex: "#881337" },
  ]
}

export function getAllTailwind950Colors(): TailwindColor[] {
  return [
    { name: "Slate", hex: "#020617" },
    { name: "Gray", hex: "#030712" },
    { name: "Zinc", hex: "#09090b" },
    { name: "Neutral", hex: "#0a0a0a" },
    { name: "Stone", hex: "#0c0a09" },
    { name: "Red", hex: "#450a0a" },
    { name: "Orange", hex: "#431407" },
    { name: "Amber", hex: "#422006" },
    { name: "Yellow", hex: "#422006" },
    { name: "Lime", hex: "#1a2e05" },
    { name: "Green", hex: "#052e16" },
    { name: "Emerald", hex: "#022c22" },
    { name: "Teal", hex: "#042f2e" },
    { name: "Cyan", hex: "#083344" },
    { name: "Sky", hex: "#082f49" },
    { name: "Blue", hex: "#172554" },
    { name: "Indigo", hex: "#1e1b4b" },
    { name: "Violet", hex: "#2e1065" },
    { name: "Purple", hex: "#3b0764" },
    { name: "Fuchsia", hex: "#4a044e" },
    { name: "Pink", hex: "#500724" },
    { name: "Rose", hex: "#4c0519" },
  ]
}

