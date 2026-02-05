import { useEffect, useMemo, useState } from "react"
import { type Theme, baseBackgrounds, highlightColors, reduceSaturation as reduceSaturationFn } from "@/lib/utils"
import { getAllRadixLevel11Colors, getAllRadixLevelColors } from "@/lib/radix-colors"
import { ContrastCell } from "./ContrastCell"
import { type ColorSystem } from "./ColorSystemSelector"

interface BackgroundColorsProps {
  theme: Theme
  colorSystem: ColorSystem
  reduceSaturation: boolean
}

export function BackgroundColors({ theme, colorSystem, reduceSaturation }: BackgroundColorsProps) {
  const baseBg = baseBackgrounds[theme]
  const borderColor = theme === "dark" ? "#3f3f46" : undefined
  const highlights = highlightColors[theme]

  // Text swatch palette:
  // - light/beige: Radix level 11 (light values)
  // - dark: Radix level 5 (light values) as requested
  const radix11Colors = useMemo(() => getAllRadixLevel11Colors(), [])
  const radix5LightColors = useMemo(
    () => getAllRadixLevelColors(5).map(c => ({ name: c.name, value: c.light })),
    []
  )

  const swatchColors = useMemo(() => {
    if (theme === "dark") {
      return radix5LightColors
    }
    return radix11Colors.map(c => ({ name: c.name, value: c.light }))
  }, [theme, radix11Colors, radix5LightColors])

  const defaultTextColor = useMemo(() => {
    const gray = swatchColors.find(c => c.name === "Gray")
    return gray ? gray.value : swatchColors[0]?.value || (theme === "dark" ? "#E4E4E7" : "#262626")
  }, [swatchColors, theme])

  const [selectedTextColor, setSelectedTextColor] = useState<string>(defaultTextColor)

  useEffect(() => {
    setSelectedTextColor(defaultTextColor)
  }, [defaultTextColor])

  // Background colors use Radix level 3 for light/beige, level 4 for dark theme
  // Dark theme (level 4) is never adjusted by the toggle
  const backgroundColors = useMemo(() => {
    const level = theme === "dark" ? 4 : 3
    const radixLevelColors = getAllRadixLevelColors(level)
    const mapped = radixLevelColors.map(c => ({
      name: c.name,
      value: theme === "dark" ? c.dark : c.light
    }))

    // Dark theme (level 4) always returns raw, never adjusted
    if (theme === "dark") return mapped

    // Light/beige: apply saturation reduction if toggle is on
    if (!reduceSaturation) return mapped

    const minLightness = (theme === "light" || theme === "beige") ? 92 : null
    return mapped.map(c => ({
      name: c.name,
      value: reduceSaturationFn(c.value, 12, minLightness, c.name, false)
    }))
  }, [theme, reduceSaturation])

  // Guard: this tab is Radix-only; inform if another system is selected
  const isRadix = colorSystem === "radix11_3" || colorSystem === "radix11_4"

  const handleCopyHex = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="space-y-0">
      {!isRadix && (
        <div
          className="p-3 text-sm border-b"
          style={{
            backgroundColor: baseBg,
            borderColor: borderColor,
            color: theme === "dark" ? "#E4E4E7" : "#262626"
          }}
        >
          Background Colors currently only supports Radix. Showing Radix level 3 (light/beige) or level 4 (dark) backgrounds.
        </div>
      )}

      {/* Sticky text color swatch selector sits outside the scroll container */}
      <div
        className="sticky z-30 p-4 border-b"
        style={{
          backgroundColor: baseBg,
          borderColor: borderColor,
          top: "115px"
        }}
      >
        <div className="flex items-center gap-3 justify-center mb-3">
          <span
            className="text-sm font-medium"
            style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
          >
            {theme === "dark" ? "Sample Text Color (Radix 5 light)" : "Sample Text Color (Radix 11 light)"}
          </span>
          <span
            className="text-xs"
            style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
          >
            Applies to all cells below
          </span>
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-w-[900px] mx-auto">
          {swatchColors.map((color) => {
            const colorValue = color.value
            const isSelected = selectedTextColor === colorValue

            return (
              <button
                key={color.name}
                onClick={() => setSelectedTextColor(colorValue)}
                className="rounded border-2 transition-all hover:scale-105"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: colorValue,
                  borderColor: isSelected
                    ? (theme === "dark" ? "#E4E4E7" : "#262626")
                    : (theme === "dark" ? "#3f3f46" : undefined),
                  borderWidth: isSelected ? "3px" : "1px"
                }}
                title={`${color.name} (${colorValue.toUpperCase()})`}
              />
            )
          })}
        </div>
      </div>

      <div className="w-full overflow-x-auto relative">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr
              className="border-b"
              style={{
                backgroundColor: baseBg,
                borderColor: borderColor
              }}
            >
              <th
                className="sticky left-0 top-0 z-30 h-8 px-1 text-left align-middle font-medium border-r min-w-[140px]"
                style={{
                  backgroundColor: baseBg,
                  color: theme === "dark" ? "#E4E4E7" : undefined,
                  borderColor: borderColor
                }}
              >
                {theme === "dark"
                  ? "Background Color (Radix 4 dark)"
                  : reduceSaturation
                  ? "Background Color (Radix 3 light Adjusted)"
                  : "Background Color (Radix 3 light)"}
              </th>
              <th
                className="h-8 px-1 text-left align-middle font-medium min-w-[140px] border-l"
                style={{
                  color: theme === "dark" ? "#E4E4E7" : undefined,
                  borderColor: borderColor
                }}
              >
                Base Background
              </th>
              {highlights.map((highlight) => (
                <th
                  key={highlight.name}
                  className="h-8 px-1 text-left align-middle font-medium min-w-[140px] border-l"
                  style={{
                    color: theme === "dark" ? "#E4E4E7" : undefined,
                    borderColor: borderColor
                  }}
                >
                  {highlight.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {backgroundColors.map((color) => {
              const bgValue = color.value

              return (
                <tr
                  key={color.name}
                  className="transition-colors hover:bg-muted/50"
                  style={{ borderColor: borderColor }}
                >
                  <td
                    className="sticky left-0 z-10 border-r border-b p-1 align-middle"
                    style={{
                      backgroundColor: baseBg,
                      borderColor: borderColor
                    }}
                  >
                    <div
                      className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleCopyHex(bgValue)}
                      title="Click to copy hex code"
                    >
                      <div
                        className="w-10 h-10 rounded border"
                        style={{
                          backgroundColor: bgValue,
                          borderColor: borderColor
                        }}
                      />
                      <span
                        className="text-xs font-medium text-center"
                        style={{ color: theme === "dark" ? "#E4E4E7" : undefined }}
                      >
                        {color.name} ({bgValue.toUpperCase()})
                      </span>
                    </div>
                  </td>
                  <td className="p-0 align-middle">
                    <ContrastCell
                      textColor={selectedTextColor}
                      backgroundColor={bgValue}
                      theme={theme}
                      cellBackgroundOverride={bgValue}
                    />
                  </td>
                  {highlights.map((highlight) => (
                    <td key={highlight.name} className="p-0 align-middle">
                      <ContrastCell
                        textColor={selectedTextColor}
                        backgroundColor={bgValue}
                        theme={theme}
                        highlightHex={highlight.hex}
                        highlightOpacity={highlight.opacity}
                        cellBackgroundOverride={bgValue}
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

