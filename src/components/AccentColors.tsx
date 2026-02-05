import { useState } from "react"
import { getAllRadixLevelColors } from "@/lib/radix-colors"
import { getAllTailwind100Colors, getAllTailwind950Colors } from "@/lib/tailwind-colors"
import { baseBackgrounds, type Theme, getGrayscaleLightness, lightnessToGrayscaleHex, getSaturation, reduceSaturation as reduceSaturationFn } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"

interface AccentColorsProps {
  theme: Theme
  colorSystem: ColorSystem
  reduceSaturation: boolean
}

interface ExistingColor {
  name: string
  light: string
  dark: string
}

const existingColors: ExistingColor[] = [
  { name: "Indigo", light: "#E8EAF6", dark: "#16182C" },
  { name: "Brown", light: "#E3DCD9", dark: "#2B1B15" },
  { name: "Lime", light: "#F5F8D5", dark: "#23260B" },
  { name: "Light green", light: "#F1F8E9", dark: "#1F260F" },
  { name: "Green", light: "#D8EED9", dark: "#0E2911" },
  { name: "Salmon", light: "#F7E6E4", dark: "#331B17" },
  { name: "Blue Gray", light: "#DEE4E7", dark: "#1D2326" },
  { name: "Cyan", light: "#E0F7FA", dark: "#142129" },
  { name: "Amber", light: "#FFF8E1", dark: "#272007" },
  { name: "Yellow", light: "#FFFDE7", dark: "#252306" },
]

// Original sidebar colors proposed to NCES (light theme only)
const originalSidebarColors: Array<{ name: string; light: string }> = [
  { name: "Pink", light: "#FAD0DE" },
  { name: "Light Blue", light: "#D7DAF0" },
  { name: "Cyan", light: "#C9F1F6" },
  { name: "Mint", light: "#C9E9E6" },
  { name: "Green", light: "#D8EED9" },
  { name: "Light Green", light: "#E7F3D9" },
  { name: "Lime", light: "#F5F8D5" },
  { name: "Yellow", light: "#FFFBD6" },
  { name: "Cream", light: "#FFF2CA" },
  { name: "Peach", light: "#FFEAC9" },
  { name: "Beige", light: "#E3DCD9" },
  { name: "Gray", light: "#F4F4F4" },
  { name: "Blue Gray", light: "#DEE4E7" },
]

// Material 50 levels for consideration (light theme only)
const material50Colors: Array<{ name: string; light: string }> = [
  { name: "Pink", light: "#FCE4EC" },
  { name: "Indigo", light: "#E8EAF6" },
  { name: "Cyan", light: "#E0F7FA" },
  { name: "Teal", light: "#E0F2F1" },
  { name: "Light Green", light: "#F1F8E9" },
  { name: "Lime", light: "#F9FBE7" },
  { name: "Yellow", light: "#FFFDE7" },
  { name: "Amber", light: "#FFF8E1" },
  { name: "Orange", light: "#FFF3E0" },
  { name: "Brown", light: "#EFEBE9" },
  { name: "Gray", light: "#FAFAFA" },
  { name: "Blue Gray", light: "#ECEFF1" },
]

export function AccentColors({ theme, colorSystem, reduceSaturation }: AccentColorsProps) {
  const baseBg = baseBackgrounds[theme]
  const borderColor = theme === "dark" ? "#3f3f46" : undefined
  const [copiedHex, setCopiedHex] = useState<string | null>(null)

  // Get accent colors based on selected system and theme
  const accentColors = (() => {
    let colors
    if (colorSystem === "radix11_3" || colorSystem === "radix11_4") {
      // Radix 11/3: level 3, Radix 11/4: level 4 (for both light/beige and dark)
      const level = colorSystem === "radix11_3" ? 3 : 4
      const radixLevelColors = getAllRadixLevelColors(level)
      colors = radixLevelColors.map(c => ({
        name: c.name,
        value: theme === "dark" ? c.dark : c.light
      }))
    } else {
      // Tailwind: level 100 for light/beige, level 950 for dark
      if (theme === "dark") {
        colors = getAllTailwind950Colors().map(c => ({ name: c.name, value: c.hex }))
      } else {
        colors = getAllTailwind100Colors().map(c => ({ name: c.name, value: c.hex }))
      }
    }
    
    // Apply saturation reduction if toggle is on
    if (reduceSaturation) {
      // For light/beige themes, target 92% lightness; for dark theme, target 11.5% lightness
      const minLightness = theme === "dark" ? 11.5 : (theme === "light" || theme === "beige") ? 92 : null
      const skipSaturationChange = theme === "dark" // Dark theme: only adjust lightness, no saturation changes
      return colors.map(c => ({
        name: c.name,
        value: reduceSaturationFn(c.value, 12, minLightness, c.name, skipSaturationChange)
      }))
    }
    
    return colors
  })()

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
      setCopiedHex(hex)
      setTimeout(() => setCopiedHex(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Get existing colors with current theme value
  const existingColorsWithValue = existingColors.map(c => ({
    name: c.name,
    value: theme === "dark" ? c.dark : c.light
  }))

  // Get original sidebar colors with current theme value (N/A for dark theme)
  const originalSidebarColorsWithValue = originalSidebarColors.map(c => ({
    name: c.name,
    value: theme === "dark" ? "N/A" : c.light
  }))

  // Get material 50 colors with current theme value (N/A for dark theme)
  const material50ColorsWithValue = material50Colors.map(c => ({
    name: c.name,
    value: theme === "dark" ? "N/A" : c.light
  }))

  // Calculate average lightness for accent colors
  const accentColorsAvgLightness = accentColors.length > 0
    ? parseFloat(
        (accentColors.reduce((sum, color) => sum + getGrayscaleLightness(color.value), 0) / 
        accentColors.length).toFixed(1)
      )
    : 0

  // Neutral colors to exclude from saturation calculations
  const neutralColorNames = ["Gray", "Mauve", "Slate", "Sage", "Olive", "Sand"]

  // Calculate average saturation for accent colors (excluding neutral colors)
  const accentColorsWithSaturation = accentColors.filter(c => !neutralColorNames.includes(c.name))
  const accentColorsAvgSaturation = accentColorsWithSaturation.length > 0
    ? parseFloat(
        (accentColorsWithSaturation.reduce((sum, color) => sum + getSaturation(color.value), 0) / 
        accentColorsWithSaturation.length).toFixed(1)
      )
    : 0

  // Calculate average lightness for existing colors
  const existingColorsAvgLightness = existingColorsWithValue.length > 0
    ? parseFloat(
        (existingColorsWithValue.reduce((sum, color) => sum + getGrayscaleLightness(color.value), 0) / 
        existingColorsWithValue.length).toFixed(1)
      )
    : 0

  // Calculate average saturation for existing colors (excluding neutral colors)
  const existingColorsWithSaturation = existingColorsWithValue.filter(c => !neutralColorNames.includes(c.name))
  const existingColorsAvgSaturation = existingColorsWithSaturation.length > 0
    ? parseFloat(
        (existingColorsWithSaturation.reduce((sum, color) => sum + getSaturation(color.value), 0) / 
        existingColorsWithSaturation.length).toFixed(1)
      )
    : 0

  // Calculate average lightness for original sidebar colors (light theme only)
  const originalSidebarColorsForLight = originalSidebarColorsWithValue.filter(c => c.value !== "N/A")
  const originalSidebarColorsAvgLightness = originalSidebarColorsForLight.length > 0
    ? parseFloat(
        (originalSidebarColorsForLight.reduce((sum, color) => sum + getGrayscaleLightness(color.value), 0) / 
        originalSidebarColorsForLight.length).toFixed(1)
      )
    : 0

  // Calculate average saturation for original sidebar colors (excluding neutral colors, light theme only)
  const originalSidebarColorsWithSaturation = originalSidebarColorsForLight.filter(c => !neutralColorNames.includes(c.name))
  const originalSidebarColorsAvgSaturation = originalSidebarColorsWithSaturation.length > 0
    ? parseFloat(
        (originalSidebarColorsWithSaturation.reduce((sum, color) => sum + getSaturation(color.value), 0) / 
        originalSidebarColorsWithSaturation.length).toFixed(1)
      )
    : 0

  // Calculate average lightness for material 50 colors (light theme only, excluding Gray and Blue Gray)
  const material50ColorsForLight = material50ColorsWithValue.filter(c => c.value !== "N/A")
  const material50ColorsForLightness = material50ColorsForLight.filter(c => c.name !== "Gray" && c.name !== "Blue Gray")
  const material50ColorsAvgLightness = material50ColorsForLightness.length > 0
    ? parseFloat(
        (material50ColorsForLightness.reduce((sum, color) => sum + getGrayscaleLightness(color.value), 0) / 
        material50ColorsForLightness.length).toFixed(1)
      )
    : 0

  // Calculate average saturation for material 50 colors (excluding neutral colors, Gray, and Blue Gray, light theme only)
  const material50ColorsWithSaturation = material50ColorsForLight.filter(c => 
    !neutralColorNames.includes(c.name) && c.name !== "Gray" && c.name !== "Blue Gray"
  )
  const material50ColorsAvgSaturation = material50ColorsWithSaturation.length > 0
    ? parseFloat(
        (material50ColorsWithSaturation.reduce((sum, color) => sum + getSaturation(color.value), 0) / 
        material50ColorsWithSaturation.length).toFixed(1)
      )
    : 0

  const renderColorRow = (color: { name: string; value: string }, allowNA: boolean = false, forceLightnessNA: boolean = false, forceSaturationNA: boolean = false) => {
    const isNA = allowNA && color.value === "N/A"
    const showLightnessNA = isNA || forceLightnessNA
    const showSaturationNA = isNA || forceLightnessNA || forceSaturationNA || neutralColorNames.includes(color.name)
    return (
      <tr 
        key={color.name} 
        className="transition-colors hover:bg-muted/50"
        style={{ borderColor: borderColor }}
      >
        <td 
          className="border-b p-1 align-middle"
          style={{ 
            backgroundColor: baseBg,
            borderColor: borderColor
          }}
        >
          <div 
            className={`flex items-center gap-3 ${isNA ? "" : "cursor-pointer hover:opacity-80 transition-opacity"}`}
            onClick={() => !isNA && handleCopyHex(color.value)}
            title={isNA ? undefined : "Click to copy hex code"}
          >
            <div
              className="w-12 h-12 rounded border flex-shrink-0"
              style={{ 
                backgroundColor: isNA ? (theme === "dark" ? "#27272a" : "#f4f4f5") : color.value,
                borderColor: borderColor,
                opacity: isNA ? 0.5 : 1
              }}
            />
            <div className="flex flex-col">
              <span 
                className="text-sm font-medium"
                style={{ color: theme === "dark" ? "#E4E4E7" : undefined }}
              >
                {color.name}
              </span>
              <span 
                className="text-xs font-mono"
                style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
              >
                {isNA ? "N/A" : color.value.toUpperCase()}
              </span>
            </div>
          </div>
        </td>
        <td 
          className="border-b p-1 align-middle"
          style={{ 
            backgroundColor: baseBg,
            borderColor: borderColor
          }}
        >
          {showLightnessNA ? (
            <span 
              className="text-sm font-mono font-medium"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
            >
              N/A
            </span>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border flex-shrink-0"
                style={{ 
                  backgroundColor: color.value,
                  borderColor: borderColor,
                  filter: "grayscale(100%)"
                }}
              />
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
              >
                {getGrayscaleLightness(color.value).toFixed(1)}%
              </span>
            </div>
          )}
        </td>
        <td 
          className="border-b p-1 align-middle"
          style={{ 
            backgroundColor: baseBg,
            borderColor: borderColor
          }}
        >
          <span 
            className="text-sm font-mono font-medium"
            style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
          >
            {showSaturationNA ? "N/A" : `${getSaturation(color.value).toFixed(1)}%`}
          </span>
        </td>
      </tr>
    )
  }

  return (
    <div className="w-full overflow-x-auto relative p-4">
      {/* Toast notification */}
      {copiedHex && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg transition-all"
          style={{
            backgroundColor: theme === "dark" ? "#27272a" : "#ffffff",
            borderColor: theme === "dark" ? "#3f3f46" : "#e4e4e7",
            borderWidth: "1px",
            color: theme === "dark" ? "#E4E4E7" : "#262626"
          }}
        >
          <span className="text-sm font-medium">Copied {copiedHex} to clipboard</span>
        </div>
      )}
      
      {/* Findings/Notes section */}
      <div className="mb-6 max-w-[800px]">
        <h3 
          className="text-lg font-semibold mb-3"
          style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
        >
          Findings/Notes
        </h3>
        <ul className="space-y-3 text-sm list-disc pl-5">
          <li className="leading-relaxed" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
            The original sidebar colors we proposed to NCES were a bit darker than what we ultimately used. This was likely due to the colors appearing too dark or saturated in practice. It's a very fine balance between the colors being too light and potentially washing out, vs. being too dark and potentially being distracting/overwhelming. Consider this image of two different chromebooks - the Indigo 75 is acceptable on the left Samsung Chromebook Plus, but becomes much more dark/saturated on the Asus Chromebook (we need to consider not just the wash-out effect, but the over-saturation effect). It feels better to er on colors being potentially washed out vs. potentially over-saturated, in terms of potential student impact. 
            <br />
            <img 
              src={import.meta.env.BASE_URL + "images/chromebooks.jpg"} 
              alt="Two different chromebooks showing color display differences"
              className="mt-3 mb-3 max-w-full rounded"
              style={{ maxWidth: "1000px" }}
            />
            <br />
            They key values to consider is lightness (100% = pure white). The following are the lightness averages for the different samples (light themes). 
            <ul className="mt-2 list-none pl-0">
              <li className="leading-relaxed flex items-center" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
                <span className="mr-2 flex-shrink-0 text-[8px] leading-none" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>○</span>
                <span>What we considered too light (material 50) - 95%</span>
              </li>
              <li className="leading-relaxed flex items-center" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
                <span className="mr-2 flex-shrink-0 text-[8px] leading-none" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>○</span>
                <span>Radix unmodified - 94%</span>
              </li>
              <li className="leading-relaxed flex items-center" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
                <span className="mr-2 flex-shrink-0 text-[8px] leading-none" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>○</span>
                <span>Radix modified/adjusted - 92%</span>
              </li>
              <li className="leading-relaxed flex items-center" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
                <span className="mr-2 flex-shrink-0 text-[8px] leading-none" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>○</span>
                <span>Colors we've used - 93%</span>
              </li>
              <li className="leading-relaxed flex items-center" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
                <span className="mr-2 flex-shrink-0 text-[8px] leading-none" style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>○</span>
                <span>Sidebar Colors Proposed to NCES (material 75) - 91%</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div className="flex gap-4">
        {/* Potential new Accent Colors table */}
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
          >
            Potential new Accent Colors{reduceSaturation ? " (adjusted)" : ""}
          </h3>
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span 
                className="text-sm"
                style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
              >
                Average lightness value:
              </span>
              <div
                className="w-8 h-8 rounded border flex-shrink-0"
                style={{ 
                  backgroundColor: lightnessToGrayscaleHex(accentColorsAvgLightness),
                  borderColor: borderColor
                }}
              />
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
              >
                {accentColorsAvgLightness.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="text-sm"
                style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
              >
                Average saturation value:
              </span>
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
              >
                {accentColorsAvgSaturation.toFixed(1)}%
              </span>
            </div>
          </div>
          <table className="w-full caption-bottom text-sm">
        <thead className="sticky top-0 z-20 [&_tr]:border-b">
          <tr 
            className="border-b" 
            style={{ 
              backgroundColor: baseBg,
              borderColor: borderColor
            }}
          >
            <th 
              className="h-8 px-1 text-left align-middle font-medium min-w-[200px]"
              style={{ 
                color: theme === "dark" ? "#E4E4E7" : undefined,
                borderColor: borderColor
              }}
            >
              Color
            </th>
            <th 
              className="h-8 px-1 text-left align-middle font-medium min-w-[150px]"
              style={{ 
                color: theme === "dark" ? "#E4E4E7" : undefined,
                borderColor: borderColor
              }}
            >
              Lightness
            </th>
            <th 
              className="h-8 px-1 text-left align-middle font-medium min-w-[100px]"
              style={{ 
                color: theme === "dark" ? "#E4E4E7" : undefined,
                borderColor: borderColor
              }}
            >
              Saturation
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {accentColors.map((color) => renderColorRow(color))}
        </tbody>
      </table>
        </div>

        {/* Existing Colors We've Used table */}
        <div className="flex-1">
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
          >
            Existing Colors We've Used
          </h3>
          <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span 
                className="text-sm"
                style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
              >
                Average lightness value:
              </span>
              <div
                className="w-8 h-8 rounded border flex-shrink-0"
                style={{ 
                  backgroundColor: lightnessToGrayscaleHex(existingColorsAvgLightness),
                  borderColor: borderColor
                }}
              />
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
              >
                {existingColorsAvgLightness.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="text-sm"
                style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
              >
                Average saturation value:
              </span>
              <span 
                className="text-sm font-mono font-medium"
                style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
              >
                {existingColorsAvgSaturation.toFixed(1)}%
              </span>
            </div>
          </div>
          <table className="w-full caption-bottom text-sm">
            <thead className="sticky top-0 z-20 [&_tr]:border-b">
              <tr 
                className="border-b" 
                style={{ 
                  backgroundColor: baseBg,
                  borderColor: borderColor
                }}
              >
                <th 
                  className="h-8 px-1 text-left align-middle font-medium min-w-[200px]"
                  style={{ 
                    color: theme === "dark" ? "#E4E4E7" : undefined,
                    borderColor: borderColor
                  }}
                >
                  Color
                </th>
                <th 
                  className="h-8 px-1 text-left align-middle font-medium min-w-[150px]"
                  style={{ 
                    color: theme === "dark" ? "#E4E4E7" : undefined,
                    borderColor: borderColor
                  }}
                >
                  Lightness
                </th>
                <th 
                  className="h-8 px-1 text-left align-middle font-medium min-w-[100px]"
                  style={{ 
                    color: theme === "dark" ? "#E4E4E7" : undefined,
                    borderColor: borderColor
                  }}
                >
                  Saturation
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {existingColorsWithValue.map((color) => renderColorRow(color))}
            </tbody>
          </table>

          {/* Original Sidebar Colors Proposed to NCES table */}
          <div className="mt-6">
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
            >
              Original Sidebar Colors Proposed to NCES (Material 75)
            </h3>
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm"
                  style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
                >
                  Average lightness value:
                </span>
                {theme === "dark" ? (
                  <span 
                    className="text-sm font-mono font-medium"
                    style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
                  >
                    N/A
                  </span>
                ) : (
                  <>
                    <div
                      className="w-8 h-8 rounded border flex-shrink-0"
                      style={{ 
                        backgroundColor: lightnessToGrayscaleHex(originalSidebarColorsAvgLightness),
                        borderColor: borderColor
                      }}
                    />
                    <span 
                      className="text-sm font-mono font-medium"
                      style={{ color: "#262626" }}
                    >
                      {originalSidebarColorsAvgLightness.toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm"
                  style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
                >
                  Average saturation value:
                </span>
                {theme === "dark" ? (
                  <span 
                    className="text-sm font-mono font-medium"
                    style={{ color: "#A1A1AA" }}
                  >
                    N/A
                  </span>
                ) : (
                  <span 
                    className="text-sm font-mono font-medium"
                    style={{ color: "#262626" }}
                  >
                    {originalSidebarColorsAvgSaturation.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <table className="w-full caption-bottom text-sm">
              <thead className="sticky top-0 z-20 [&_tr]:border-b">
                <tr 
                  className="border-b" 
                  style={{ 
                    backgroundColor: baseBg,
                    borderColor: borderColor
                  }}
                >
                  <th 
                    className="h-8 px-1 text-left align-middle font-medium min-w-[200px]"
                    style={{ 
                      color: theme === "dark" ? "#E4E4E7" : undefined,
                      borderColor: borderColor
                    }}
                  >
                    Color
                  </th>
                  <th 
                    className="h-8 px-1 text-left align-middle font-medium min-w-[150px]"
                    style={{ 
                      color: theme === "dark" ? "#E4E4E7" : undefined,
                      borderColor: borderColor
                    }}
                  >
                    Lightness
                  </th>
                  <th 
                    className="h-8 px-1 text-left align-middle font-medium min-w-[100px]"
                    style={{ 
                      color: theme === "dark" ? "#E4E4E7" : undefined,
                      borderColor: borderColor
                    }}
                  >
                    Saturation
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {originalSidebarColorsWithValue.map((color) => renderColorRow(color, true))}
              </tbody>
            </table>
          </div>

          {/* Material 50 Levels for Consideration table */}
          <div className="mt-6">
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
            >
              Material 50 Levels for Consideration
            </h3>
            <div className="flex flex-col gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm"
                  style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
                >
                  Average lightness value:
                </span>
                {theme === "dark" ? (
                  <span 
                    className="text-sm font-mono font-medium"
                    style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
                  >
                    N/A
                  </span>
                ) : (
                  <>
                    <div
                      className="w-8 h-8 rounded border flex-shrink-0"
                      style={{ 
                        backgroundColor: lightnessToGrayscaleHex(material50ColorsAvgLightness),
                        borderColor: borderColor
                      }}
                    />
                    <span 
                      className="text-sm font-mono font-medium"
                      style={{ color: "#262626" }}
                    >
                      {material50ColorsAvgLightness.toFixed(1)}%
                    </span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span 
                  className="text-sm"
                  style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
                >
                  Average saturation value:
                </span>
                {theme === "dark" ? (
                  <span 
                    className="text-sm font-mono font-medium"
                    style={{ color: "#A1A1AA" }}
                  >
                    N/A
                  </span>
                ) : (
                  <span 
                    className="text-sm font-mono font-medium"
                    style={{ color: "#262626" }}
                  >
                    {material50ColorsAvgSaturation.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
            <table className="w-full caption-bottom text-sm">
              <thead className="sticky top-0 z-20 [&_tr]:border-b">
                <tr 
                  className="border-b" 
                  style={{ 
                    backgroundColor: baseBg,
                    borderColor: borderColor
                  }}
                >
                  <th 
                    className="h-8 px-1 text-left align-middle font-medium min-w-[200px]"
                    style={{ 
                      color: theme === "dark" ? "#E4E4E7" : undefined,
                      borderColor: borderColor
                    }}
                  >
                    Color
                  </th>
                  <th 
                    className="h-8 px-1 text-left align-middle font-medium min-w-[150px]"
                    style={{ 
                      color: theme === "dark" ? "#E4E4E7" : undefined,
                      borderColor: borderColor
                    }}
                  >
                    Lightness
                  </th>
                  <th 
                    className="h-8 px-1 text-left align-middle font-medium min-w-[100px]"
                    style={{ 
                      color: theme === "dark" ? "#E4E4E7" : undefined,
                      borderColor: borderColor
                    }}
                  >
                    Saturation
                  </th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {material50ColorsWithValue.map((color) => {
                  // Show N/A for Gray and Blue Gray lightness and saturation
                  const isMaterial50Neutral = color.name === "Gray" || color.name === "Blue Gray"
                  return renderColorRow(color, true, isMaterial50Neutral, isMaterial50Neutral)
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

