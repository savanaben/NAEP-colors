import { useMemo } from "react"
import { getAllRadixLevel11Colors, getAllRadixLevelColors } from "@/lib/radix-colors"
import { applyRadixLightOverride } from "@/lib/radix-light-overrides"
import { reduceSaturation as reduceSaturationFn, getGrayscaleLightness } from "@/lib/utils"
import { type Theme } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"

interface FinalColorsProps {
  theme: Theme
  colorSystem: ColorSystem
  reduceSaturation: boolean
  radixLightOverrides: boolean
}

const LIGHT_BG = "#FFFFFF"
const DARK_BG = "#000000"
const BORDER = "#e4e4e7"
const BORDER_DARK = "#3f3f46"

function textOnColor(hex: string): string {
  return getGrayscaleLightness(hex) > 50 ? "#000000" : "#ffffff"
}

export function FinalColors({
  theme,
  colorSystem,
  reduceSaturation,
  radixLightOverrides,
}: FinalColorsProps) {
  const isRadix = colorSystem === "radix11_3" || colorSystem === "radix11_4"
  const accentLevel = colorSystem === "radix11_4" ? 4 : 3

  const rows = useMemo(() => {
    if (!isRadix) return []

    const radix11 = getAllRadixLevel11Colors()
    const radixBgLight = getAllRadixLevelColors(3) // background light/beige
    const radixBgDark = getAllRadixLevelColors(4)  // background dark
    const radixAccent = getAllRadixLevelColors(accentLevel)

    const minLightnessLight = 92
    const minLightnessDark = 11.5
    const skipSaturationDark = true

    return radix11.map((c) => {
      const name = c.name

      // Text: 11 light (with override) / 11 dark
      const textLight = applyRadixLightOverride(c.light, "light", colorSystem, radixLightOverrides)
      const textDark = c.dark

      // Background: level 3 light (optional reduceSaturation) / level 4 dark
      const bgLightRaw = radixBgLight.find((x) => x.name === name)?.light ?? c.light
      const bgDarkRaw = radixBgDark.find((x) => x.name === name)?.dark ?? c.dark
      const bgLight = reduceSaturation
        ? reduceSaturationFn(bgLightRaw, 12, minLightnessLight, name, false)
        : bgLightRaw
      const bgDark = bgDarkRaw

      // Accent: level 3 or 4 light/dark (optional reduceSaturation)
      const accLightRaw = radixAccent.find((x) => x.name === name)?.light ?? c.light
      const accDarkRaw = radixAccent.find((x) => x.name === name)?.dark ?? c.dark
      const accLight = reduceSaturation
        ? reduceSaturationFn(accLightRaw, 12, minLightnessLight, name, false)
        : accLightRaw
      const accDark = reduceSaturation
        ? reduceSaturationFn(accDarkRaw, 12, minLightnessDark, name, skipSaturationDark)
        : accDarkRaw

      return {
        name,
        textLight,
        textDark,
        bgLight,
        bgDark,
        accLight,
        accDark,
      }
    })
  }, [isRadix, colorSystem, radixLightOverrides, reduceSaturation, accentLevel])

  const borderColor = theme === "dark" ? BORDER_DARK : BORDER
  const headerFg = theme === "dark" ? "#E4E4E7" : "#262626"
  const subHeaderFg = theme === "dark" ? "#A1A1AA" : "#71717a"

  if (!isRadix) {
    return (
      <div className="p-4">
        <div
          className="p-4 rounded-lg border text-sm"
          style={{
            backgroundColor: theme === "dark" ? "#27272a" : "#f4f4f5",
            borderColor,
            color: headerFg,
          }}
        >
          Final Colors is only available when using a Radix color system (Radix 11/3 or Radix 11/4).
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div
        className="border rounded-lg overflow-hidden"
        style={{ borderColor }}
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full caption-bottom text-sm border-collapse">
            <thead>
              {/* Tier 1: Text Color | Background Color | Accent Color */}
              <tr style={{ backgroundColor: theme === "dark" ? "#27272a" : "#fafafa", borderBottom: `1px solid ${borderColor}` }}>
                <th
                  className="text-left font-medium px-3 py-2 border-r align-bottom"
                  style={{ borderColor, color: headerFg, minWidth: 90 }}
                >
                  Color
                </th>
                <th
                  colSpan={2}
                  className="text-center font-medium px-2 py-1 border-r"
                  style={{ borderColor, color: headerFg }}
                >
                  Text Color
                </th>
                <th
                  colSpan={2}
                  className="text-center font-medium px-2 py-1 border-r"
                  style={{ borderColor, color: headerFg }}
                >
                  Background Color
                </th>
                <th
                  colSpan={2}
                  className="text-center font-medium px-2 py-1"
                  style={{ borderColor, color: headerFg }}
                >
                  Accent Color
                </th>
              </tr>
              {/* Tier 2: Light/Beige | Dark (x3) */}
              <tr style={{ backgroundColor: theme === "dark" ? "#27272a" : "#fafafa", borderBottom: `1px solid ${borderColor}` }}>
                <th className="w-[90px]" style={{ borderColor }} />
                <th
                  className="text-center font-normal px-2 py-1.5 border-r min-w-[88px]"
                  style={{ borderColor, color: subHeaderFg, backgroundColor: LIGHT_BG }}
                >
                  Light/Beige
                </th>
                <th
                  className="text-center font-normal px-2 py-1.5 border-r min-w-[88px]"
                  style={{ borderColor, color: "#a1a1aa", backgroundColor: DARK_BG }}
                >
                  Dark
                </th>
                <th
                  className="text-center font-normal px-2 py-1.5 border-r min-w-[88px]"
                  style={{ borderColor, color: subHeaderFg, backgroundColor: LIGHT_BG }}
                >
                  Light/Beige
                </th>
                <th
                  className="text-center font-normal px-2 py-1.5 border-r min-w-[88px]"
                  style={{ borderColor, color: "#a1a1aa", backgroundColor: DARK_BG }}
                >
                  Dark
                </th>
                <th
                  className="text-center font-normal px-2 py-1.5 border-r min-w-[88px]"
                  style={{ borderColor, color: subHeaderFg, backgroundColor: LIGHT_BG }}
                >
                  Light/Beige
                </th>
                <th
                  className="text-center font-normal px-2 py-1.5 min-w-[88px]"
                  style={{ borderColor, color: "#a1a1aa", backgroundColor: DARK_BG }}
                >
                  Dark
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <td
                    className="px-3 py-2 border-r font-medium"
                    style={{ borderColor, color: headerFg, backgroundColor: theme === "dark" ? "#18181b" : "#fff" }}
                  >
                    {row.name}
                  </td>
                  <td
                    className="px-2 py-2 border-r text-center font-mono font-bold text-[10px]"
                    style={{ borderColor, backgroundColor: LIGHT_BG, color: row.textLight }}
                  >
                    {row.textLight.toUpperCase()}
                  </td>
                  <td
                    className="px-2 py-2 border-r text-center font-mono font-bold text-[10px]"
                    style={{ borderColor, backgroundColor: DARK_BG, color: row.textDark }}
                  >
                    {row.textDark.toUpperCase()}
                  </td>
                  <td
                    className="px-2 py-2 border-r text-center text-[10px] font-mono"
                    style={{ borderColor, backgroundColor: row.bgLight, color: textOnColor(row.bgLight) }}
                    title={row.bgLight}
                  >
                    {row.bgLight.toUpperCase()}
                  </td>
                  <td
                    className="px-2 py-2 border-r text-center text-[10px] font-mono"
                    style={{ borderColor, backgroundColor: row.bgDark, color: textOnColor(row.bgDark) }}
                    title={row.bgDark}
                  >
                    {row.bgDark.toUpperCase()}
                  </td>
                  <td
                    className="px-2 py-2 border-r text-center text-[10px] font-mono"
                    style={{ borderColor, backgroundColor: row.accLight, color: textOnColor(row.accLight) }}
                    title={row.accLight}
                  >
                    {row.accLight.toUpperCase()}
                  </td>
                  <td
                    className="px-2 py-2 text-center text-[10px] font-mono"
                    style={{ borderColor, backgroundColor: row.accDark, color: textOnColor(row.accDark) }}
                    title={row.accDark}
                  >
                    {row.accDark.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
