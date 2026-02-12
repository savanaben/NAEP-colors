import { useMemo, useState } from "react"
import { getFinalColorRows } from "@/lib/final-colors-data"
import { type Theme } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"
import { BackgroundColorRulesAccordion } from "@/components/BackgroundColorRulesAccordion"

interface BgSwatch {
  name: string
  value: string
}

interface BgSimpleSelectorProps {
  theme: Theme
  colorSystem: ColorSystem
  reduceSaturation: boolean
  radixLightOverrides: boolean
}

const SWATCH_SIZE = 24
const BORDER = "#e4e4e7"
const BORDER_DARK = "#3f3f46"
const SWATCH_BORDER = "#949494"
const SELECTED_BORDER_COLOR = "#6366f1"
const SELECTED_BORDER_WIDTH = 4

const TRANSPARENT_SWATCH: BgSwatch = { name: "Transparent", value: "transparent" }

export function BgSimpleSelector({
  theme,
  colorSystem,
  reduceSaturation,
  radixLightOverrides,
}: BgSimpleSelectorProps) {
  const isRadix = colorSystem === "radix11_3" || colorSystem === "radix11_4"
  const rows = useMemo(
    () => getFinalColorRows(colorSystem, reduceSaturation, radixLightOverrides),
    [colorSystem, reduceSaturation, radixLightOverrides]
  )

  const bgSwatchesLight: BgSwatch[] = useMemo(() => {
    const white = { name: "White", value: "#FFFFFF" }
    const lightPalette = rows.map((r) => ({ name: r.name, value: r.bgLight }))
    return [TRANSPARENT_SWATCH, white, ...lightPalette]
  }, [rows])

  const bgSwatchesDark: BgSwatch[] = useMemo(() => {
    const black = { name: "Black", value: "#000000" }
    const darkPalette = rows.map((r) => ({ name: `${r.name} (dark)`, value: r.bgDark }))
    return [TRANSPARENT_SWATCH, black, ...darkPalette]
  }, [rows])

  const [selectedBg, setSelectedBg] = useState<BgSwatch | null>(null)

  const borderColor = theme === "dark" ? BORDER_DARK : BORDER
  const headerFg = theme === "dark" ? "#E4E4E7" : "#262626"
  const subFg = theme === "dark" ? "#A1A1AA" : "#71717a"
  const defaultBg = theme === "dark" ? "#27272a" : "#ffffff"
  const defaultTextColor = theme === "dark" ? "#EBEBEB" : "#262626"

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
          Selector (BG Simple) is only available when using a Radix color system (Radix 11/3 or Radix 11/4).
        </div>
      </div>
    )
  }

  const isSelected = (s: BgSwatch) =>
    selectedBg && selectedBg.name === s.name && selectedBg.value === s.value

  const defaultSwatchLight = bgSwatchesLight.find((s) => s.name === "White") ?? bgSwatchesLight[1]
  const defaultSwatchDark = bgSwatchesDark.find((s) => s.name === "Black") ?? bgSwatchesDark[1]

  const displayBg =
    theme === "dark" && selectedBg
      ? selectedBg.name === "Transparent"
        ? "transparent"
        : selectedBg.name === "White"
          ? "#000000"
          : selectedBg.name === "Black" || selectedBg.name.endsWith(" (dark)")
            ? selectedBg.value
            : (rows.find((r) => r.name === selectedBg.name)?.bgDark ?? selectedBg.value)
      : (selectedBg?.value ?? defaultBg)

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      <aside
        className="flex-shrink-0 w-full lg:w-[300px] space-y-6 p-4 rounded-lg border"
        style={{ borderColor, backgroundColor: theme === "dark" ? "#18181b" : "#fafafa" }}
      >
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: headerFg }}>
            Background color
          </h3>
          <BackgroundColorRulesAccordion theme={theme} />
          {(["light", "dark"] as const).map((themeVariant) => (
            <div key={themeVariant} className="mb-3">
              <p className="text-xs font-medium mb-1.5" style={{ color: subFg }}>
                {themeVariant === "light" ? "Light background" : "Dark background"}
              </p>
              <div className="flex flex-wrap gap-1">
                {(themeVariant === "light" ? bgSwatchesLight : bgSwatchesDark).map((s) => {
                  const selected = isSelected(s)
                  const defaultForSection = themeVariant === "light" ? defaultSwatchLight : defaultSwatchDark
                  return (
                    <button
                      key={s.name + s.value}
                      onClick={() => {
                        if (selected) {
                          setSelectedBg(defaultForSection)
                        } else {
                          setSelectedBg(s)
                        }
                      }}
                      className="rounded transition-all hover:scale-105 relative"
                      style={{
                        width: SWATCH_SIZE,
                        height: SWATCH_SIZE,
                        backgroundColor: s.name === "Transparent" ? "#ffffff" : s.value,
                        border: `1px solid ${SWATCH_BORDER}`,
                        outline: selected ? `${SELECTED_BORDER_WIDTH}px solid ${SELECTED_BORDER_COLOR}` : "none",
                        outlineOffset: 2,
                      }}
                      title={s.name === "Transparent" ? "Transparent (no background)" : s.name}
                    >
                      {s.name === "Transparent" && (
                        <span
                          className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          aria-hidden
                        >
                          <span
                            style={{
                              position: "absolute",
                              width: "140%",
                              height: 2,
                              backgroundColor: "#dc2626",
                              transform: "rotate(-45deg)",
                            }}
                          />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold mb-3" style={{ color: headerFg }}>
          Preview
        </h3>
        <div
          className="p-4 rounded-xl border max-w-xl font-semibold"
          style={{
            backgroundColor: displayBg,
            borderColor: theme === "dark" ? "#3f3f46" : "#EBEBEB",
            fontFamily: "Calibri, sans-serif",
          }}
        >
          <h4
            style={{
              color: defaultTextColor,
              marginBottom: "8px",
              marginTop: 0,
              fontSize: "36px",
              fontWeight: "bold",
              lineHeight: 1.1,
            }}
          >
            Sample card
          </h4>
          <p
            style={{
              color: defaultTextColor,
              margin: 0,
              fontSize: "24px",
              lineHeight: 1.4,
              fontWeight: "normal",
            }}
          >
            Title and body use default text color. Only the background changes.
          </p>
        </div>
      </div>
    </div>
  )
}
