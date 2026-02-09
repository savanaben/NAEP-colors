import { useMemo, useState, useEffect } from "react"
import { getFinalColorRows } from "@/lib/final-colors-data"
import { type Theme } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"
import { DemoCard } from "@/components/DemoCard"
import { BackgroundColorRulesAccordion } from "@/components/BackgroundColorRulesAccordion"

type ThemeVariant = "light" | "dark"

interface SwatchItem {
  name: string
  theme: ThemeVariant
  value: string
}

interface ColorSelectorProps {
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

// Text color names to exclude from the text selector (both light and dark)
const TEXT_SELECTOR_EXCLUDE_NAMES = ["Mauve", "Slate", "Sage", "Olive", "Sand"]

// Default body text (default black/white) and page-style backgrounds (white/black)
const DEFAULT_TEXT_SWATCHES: SwatchItem[] = [
  { name: "Default black", theme: "light", value: "#262626" },
  { name: "Default white", theme: "dark", value: "#EBEBEB" },
]
const DEFAULT_BG_SWATCHES: SwatchItem[] = [
  { name: "White", theme: "light", value: "#FFFFFF" },
  { name: "Black", theme: "dark", value: "#000000" },
]
const TRANSPARENT_BG_SWATCH: SwatchItem = {
  name: "Transparent",
  theme: "light",
  value: "transparent",
}

export function ColorSelector({
  theme,
  colorSystem,
  reduceSaturation,
  radixLightOverrides,
}: ColorSelectorProps) {
  const isRadix = colorSystem === "radix11_3" || colorSystem === "radix11_4"
  const rows = useMemo(
    () => getFinalColorRows(colorSystem, reduceSaturation, radixLightOverrides),
    [colorSystem, reduceSaturation, radixLightOverrides]
  )

  const textSwatches: SwatchItem[] = useMemo(() => {
    const textRows = rows.filter((r) => !TEXT_SELECTOR_EXCLUDE_NAMES.includes(r.name))
    const light = textRows.map((r) => ({ name: r.name, theme: "light" as ThemeVariant, value: r.textLight }))
    const dark = textRows.map((r) => ({ name: r.name, theme: "dark" as ThemeVariant, value: r.textDark }))
    const defaultBlack = DEFAULT_TEXT_SWATCHES.find((s) => s.theme === "light")!
    const defaultWhite = DEFAULT_TEXT_SWATCHES.find((s) => s.theme === "dark")!
    return [defaultBlack, ...light, defaultWhite, ...dark]
  }, [rows])

  const bgSwatchesAll: SwatchItem[] = useMemo(() => {
    const dark = rows.map((r) => ({ name: r.name, theme: "dark" as ThemeVariant, value: r.bgDark }))
    const light = rows.map((r) => ({ name: r.name, theme: "light" as ThemeVariant, value: r.bgLight }))
    return [...DEFAULT_BG_SWATCHES, ...dark, ...light]
  }, [rows])

  const [selectedText, setSelectedText] = useState<SwatchItem | null>(null)
  const [selectedBg, setSelectedBg] = useState<SwatchItem | null>(null)

  const bgSwatchesLight = useMemo(() => {
    const white = DEFAULT_BG_SWATCHES.find((b) => b.theme === "light")!
    const lightPalette = rows.map((r) => ({ name: r.name, theme: "light" as ThemeVariant, value: r.bgLight }))
    return [TRANSPARENT_BG_SWATCH, white, ...lightPalette]
  }, [rows])

  const bgSwatchesDark = useMemo(() => {
    const black = DEFAULT_BG_SWATCHES.find((b) => b.theme === "dark")!
    const darkPalette = rows.map((r) => ({ name: r.name, theme: "dark" as ThemeVariant, value: r.bgDark }))
    return [TRANSPARENT_BG_SWATCH, black, ...darkPalette]
  }, [rows])

  const bgSectionsToShow: ("light" | "dark")[] = useMemo(() => {
    if (!selectedText) return ["light", "dark"]
    return [selectedText.theme]
  }, [selectedText])

  useEffect(() => {
    if (!selectedText || !selectedBg) return
    if (selectedBg.name === "Transparent") return
    if (selectedBg.theme !== selectedText.theme) setSelectedBg(null)
  }, [selectedText, selectedBg])

  const borderColor = theme === "dark" ? BORDER_DARK : BORDER
  const headerFg = theme === "dark" ? "#E4E4E7" : "#262626"
  const subFg = theme === "dark" ? "#A1A1AA" : "#71717a"

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
          Color Selector is only available when using a Radix color system (Radix 11/3 or Radix 11/4).
        </div>
      </div>
    )
  }

  const isSelectedText = (s: SwatchItem) =>
    selectedText && selectedText.name === s.name && selectedText.theme === s.theme
  const isSelectedBg = (s: SwatchItem) =>
    selectedBg && selectedBg.name === s.name && selectedBg.theme === s.theme

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      {/* Sidebar ~300px: two sets of swatches */}
      <aside
        className="flex-shrink-0 w-full lg:w-[300px] space-y-6 p-4 rounded-lg border"
        style={{ borderColor, backgroundColor: theme === "dark" ? "#18181b" : "#fafafa" }}
      >
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: headerFg }}>
            Header/title text color
          </h3>
          {(["light", "dark"] as const).map((themeVariant) => (
            <div key={themeVariant} className="mb-3">
              <p className="text-xs font-medium mb-1.5" style={{ color: subFg }}>
                {themeVariant === "light" ? "Light/Beige Theme" : "Dark theme"}
              </p>
              <div className="flex flex-wrap gap-1">
                {textSwatches
                  .filter((s) => s.theme === themeVariant)
                  .map((s) => {
                    const selected = isSelectedText(s)
                    return (
                      <button
                        key={`${s.name}-${s.theme}`}
                        onClick={() => {
                          if (selected) {
                            setSelectedText(DEFAULT_TEXT_SWATCHES.find((t) => t.theme === s.theme)!)
                          } else {
                            setSelectedText(s)
                            if (!selectedBg || selectedBg.theme !== s.theme) {
                              if (selectedBg?.name === "Transparent") {
                                setSelectedBg(TRANSPARENT_BG_SWATCH)
                              } else {
                                const inverseBg = selectedBg
                                  ? bgSwatchesAll.find((b) => b.theme === s.theme && b.name === selectedBg.name)
                                  : null
                                setSelectedBg(inverseBg ?? DEFAULT_BG_SWATCHES.find((b) => b.theme === s.theme)!)
                              }
                            }
                          }
                        }}
                        className="rounded transition-all hover:scale-105"
                        style={{
                          width: SWATCH_SIZE,
                          height: SWATCH_SIZE,
                          backgroundColor: s.value,
                          border: `1px solid ${SWATCH_BORDER}`,
                          outline: selected ? `${SELECTED_BORDER_WIDTH}px solid ${SELECTED_BORDER_COLOR}` : "none",
                          outlineOffset: 2,
                        }}
                        title={`${s.name} (${s.theme})`}
                      />
                    )
                  })}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: headerFg }}>
            Background color
          </h3>
          <BackgroundColorRulesAccordion theme={theme} />
          {bgSectionsToShow.map((themeVariant) => (
            <div key={themeVariant} className="mb-3">
              <p className="text-xs font-medium mb-1.5" style={{ color: subFg }}>
                {themeVariant === "light" ? "Light/Beige Theme" : "Dark theme"}
              </p>
              <div className="flex flex-wrap gap-1">
                {(themeVariant === "light" ? bgSwatchesLight : bgSwatchesDark).map((s) => {
                  const selected = isSelectedBg(s)
                  return (
                    <button
                      key={`${s.name}-${s.theme}`}
                      onClick={() => {
                        if (selected) {
                          setSelectedBg(DEFAULT_BG_SWATCHES.find((b) => b.theme === s.theme)!)
                        } else {
                          setSelectedBg(s)
                          if (s.name !== "Transparent" && (!selectedText || selectedText.theme !== s.theme)) {
                            const inverseText = selectedText
                              ? textSwatches.find((t) => t.theme === s.theme && t.name === selectedText.name)
                              : null
                            setSelectedText(inverseText ?? DEFAULT_TEXT_SWATCHES.find((t) => t.theme === s.theme)!)
                          }
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
                      title={s.name === "Transparent" ? "Transparent (no background)" : `${s.name} (${s.theme})`}
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

      {/* Sample card: same setup as Passage Demo (header gets selected text color; body auto from bg) */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold mb-3" style={{ color: headerFg }}>
          Preview
        </h3>
        <div className="max-w-xl">
          <DemoCard
            backgroundColor={selectedBg?.value ?? (theme === "dark" ? "#27272a" : "#ffffff")}
            headingColor={selectedText?.value ?? (theme === "dark" ? "#E4E4E7" : "#262626")}
            title="Sample card"
            theme={theme}
          >
            This block shows the selected text color on the heading only. Body text uses a readable
            color derived from the background. Choose a text color and a background color from the
            sidebar to see the combination here.
          </DemoCard>
        </div>
      </div>
    </div>
  )
}
