import { useMemo, useState } from "react"
import { getFinalColorRows } from "@/lib/final-colors-data"
import { type Theme, baseBackgrounds } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"

interface TextSwatch {
  name: string
  value: string
}

interface TextColorSelectorProps {
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

const TEXT_SELECTOR_EXCLUDE_NAMES = ["Mauve", "Slate", "Sage", "Olive", "Sand"]

export function TextColorSelector({
  theme,
  colorSystem,
  reduceSaturation,
  radixLightOverrides,
}: TextColorSelectorProps) {
  const isRadix = colorSystem === "radix11_3" || colorSystem === "radix11_4"
  const rows = useMemo(
    () => getFinalColorRows(colorSystem, reduceSaturation, radixLightOverrides),
    [colorSystem, reduceSaturation, radixLightOverrides]
  )

  const textSwatchesLight: TextSwatch[] = useMemo(() => {
    const textRows = rows.filter((r) => !TEXT_SELECTOR_EXCLUDE_NAMES.includes(r.name))
    const defaultSwatch: TextSwatch = { name: "Default black", value: "#262626" }
    const palette = textRows.map((r) => ({ name: r.name, value: r.textLight }))
    return [defaultSwatch, ...palette]
  }, [rows])

  const textSwatchesDark: TextSwatch[] = useMemo(() => {
    const textRows = rows.filter((r) => !TEXT_SELECTOR_EXCLUDE_NAMES.includes(r.name))
    const defaultSwatch: TextSwatch = { name: "Default white", value: "#EBEBEB" }
    const palette = textRows.map((r) => ({ name: r.name, value: r.textDark }))
    return [defaultSwatch, ...palette]
  }, [rows])

  const [selectedText, setSelectedText] = useState<TextSwatch | null>(null)

  const borderColor = theme === "dark" ? BORDER_DARK : BORDER
  const headerFg = theme === "dark" ? "#E4E4E7" : "#262626"
  const subFg = theme === "dark" ? "#A1A1AA" : "#71717a"
  const defaultTextColor = theme === "dark" ? "#EBEBEB" : "#262626"
  const pageBg = baseBackgrounds[theme]

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
          Selector (text color) is only available when using a Radix color system (Radix 11/3 or Radix 11/4).
        </div>
      </div>
    )
  }

  const isSelected = (s: TextSwatch) =>
    selectedText && selectedText.name === s.name && selectedText.value === s.value

  const defaultForLight = textSwatchesLight[0]
  const defaultForDark = textSwatchesDark[0]

  const displayTextColor =
    theme === "dark"
      ? selectedText
        ? (textSwatchesDark.find((s) => s.name === selectedText.name)?.value ?? defaultForDark.value)
        : defaultTextColor
      : (selectedText?.value ?? defaultTextColor)

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-6">
      <aside
        className="flex-shrink-0 w-full lg:w-[300px] space-y-6 p-4 rounded-lg border"
        style={{ borderColor, backgroundColor: theme === "dark" ? "#18181b" : "#fafafa" }}
      >
        <div>
          <h3 className="text-sm font-semibold mb-2" style={{ color: headerFg }}>
            Text color
          </h3>
          {(["light", "dark"] as const).map((themeVariant) => (
            <div key={themeVariant} className="mb-3">
              <p className="text-xs font-medium mb-1.5" style={{ color: subFg }}>
                {themeVariant === "light" ? "On light background" : "On dark background"}
              </p>
              <div className="flex flex-wrap gap-1">
                {(themeVariant === "light" ? textSwatchesLight : textSwatchesDark).map((s) => {
                  const selected = isSelected(s)
                  const defaultForSection = themeVariant === "light" ? defaultForLight : defaultForDark
                  return (
                    <button
                      key={s.name + s.value}
                      onClick={() => {
                        if (selected) {
                          setSelectedText(defaultForSection)
                        } else {
                          setSelectedText(s)
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
                      title={s.name}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-0">
        <h3 className="text-sm font-semibold mb-3 flex-shrink-0" style={{ color: headerFg }}>
          Preview
        </h3>
        <div
          className="flex flex-1 min-h-[80px] rounded-lg overflow-hidden border items-center px-4"
          style={{ borderColor, backgroundColor: pageBg }}
        >
          <h4
            className="m-0 font-bold leading-tight"
            style={{
              color: displayTextColor,
              fontSize: "36px",
              lineHeight: 1.1,
              fontFamily: "Calibri, sans-serif",
            }}
          >
            Sample heading text
          </h4>
        </div>
      </div>
    </div>
  )
}
