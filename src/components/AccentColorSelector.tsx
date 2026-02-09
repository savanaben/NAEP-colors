import { useMemo, useState } from "react"
import { getFinalColorRows } from "@/lib/final-colors-data"
import { type Theme, baseBackgrounds } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"
import { BackgroundColorRulesAccordion } from "@/components/BackgroundColorRulesAccordion"

interface AccentSwatch {
  name: string
  value: string
}

interface AccentColorSelectorProps {
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

const TRANSPARENT_SWATCH: AccentSwatch = { name: "Transparent", value: "transparent" }

export function AccentColorSelector({
  theme,
  colorSystem,
  reduceSaturation,
  radixLightOverrides,
}: AccentColorSelectorProps) {
  const isRadix = colorSystem === "radix11_3" || colorSystem === "radix11_4"
  const rows = useMemo(
    () => getFinalColorRows(colorSystem, reduceSaturation, radixLightOverrides),
    [colorSystem, reduceSaturation, radixLightOverrides]
  )

  const accentSwatches: AccentSwatch[] = useMemo(() => {
    const defaultSwatch =
      theme === "dark" ? { name: "Black", value: "#000000" } : { name: "White", value: "#FFFFFF" }
    const palette =
      theme === "dark"
        ? rows.map((r) => ({ name: r.name, value: r.bgDark }))
        : rows.map((r) => ({ name: r.name, value: r.bgLight }))
    return [TRANSPARENT_SWATCH, defaultSwatch, ...palette]
  }, [theme, rows])

  const [selectedBg, setSelectedBg] = useState<AccentSwatch | null>(null)

  const borderColor = theme === "dark" ? BORDER_DARK : BORDER
  const headerFg = theme === "dark" ? "#E4E4E7" : "#262626"
  const subFg = theme === "dark" ? "#A1A1AA" : "#71717a"
  const defaultBg = theme === "dark" ? "#27272a" : "#ffffff"

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
          Accent Color Selector is only available when using a Radix color system (Radix 11/3 or Radix 11/4).
        </div>
      </div>
    )
  }

  const isSelected = (s: AccentSwatch) =>
    selectedBg && selectedBg.name === s.name && selectedBg.value === s.value

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      <aside
        className="flex-shrink-0 w-full lg:w-[300px] space-y-6 p-4 rounded-lg border"
        style={{ borderColor, backgroundColor: theme === "dark" ? "#18181b" : "#fafafa" }}
      >
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: headerFg }}>
            Background color (accent)
          </h3>
          <p className="text-xs mb-2" style={{ color: subFg }}>
            Accent colors are often used for colored sidebars.
          </p>
          <BackgroundColorRulesAccordion theme={theme} />
          <div className="flex flex-wrap gap-1">
            {accentSwatches.map((s) => {
              const selected = isSelected(s)
              const defaultSwatch: AccentSwatch =
                theme === "dark" ? { name: "Black", value: "#000000" } : { name: "White", value: "#FFFFFF" }
              return (
                <button
                  key={s.name + s.value}
                  onClick={() => {
                    if (selected) {
                      setSelectedBg(defaultSwatch)
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
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold mb-3 flex-shrink-0" style={{ color: headerFg }}>
          Preview
        </h3>
        <div
          className="flex flex-1 min-h-[120px] rounded-lg overflow-hidden border"
          style={{ borderColor }}
        >
          <div
            className="flex-[2] min-w-0"
            style={{ backgroundColor: selectedBg?.value ?? defaultBg }}
          />
          <div
            className="flex-[4] min-w-0"
            style={{ backgroundColor: baseBackgrounds[theme] }}
          />
          <div
            className="flex-[2] min-w-0"
            style={{ backgroundColor: selectedBg?.value ?? defaultBg }}
          />
        </div>
      </div>
    </div>
  )
}
