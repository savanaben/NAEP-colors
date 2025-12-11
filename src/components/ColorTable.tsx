import { getAllRadixLevel11Colors } from "@/lib/radix-colors"
import { getAllTailwind700Colors, getAllTailwind800Colors, getAllTailwind200Colors, getAllTailwind300Colors } from "@/lib/tailwind-colors"
import { highlightColors, baseBackgrounds, type Theme } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"
import { ContrastCell } from "./ContrastCell"

interface ColorTableProps {
  theme: Theme
  colorSystem: ColorSystem
}

export function ColorTable({ theme, colorSystem }: ColorTableProps) {
  const radixColors = getAllRadixLevel11Colors()
  const tailwind700Colors = getAllTailwind700Colors()
  const tailwind800Colors = getAllTailwind800Colors()
  const tailwind200Colors = getAllTailwind200Colors()
  const tailwind300Colors = getAllTailwind300Colors()
  const highlights = highlightColors[theme]
  const baseBg = baseBackgrounds[theme]
  const textColor = theme === "dark" ? "dark" : "light"
  const borderColor = theme === "dark" ? "#3f3f46" : undefined

  // Get colors based on selected system and theme
  const colors = colorSystem === "radix"
    ? radixColors.map(c => ({
        name: c.name,
        value: textColor === "dark" ? c.dark : c.light
      }))
    : colorSystem === "tailwind700"
    ? (theme === "dark" 
        ? tailwind300Colors.map(c => ({ name: c.name, value: c.hex }))
        : tailwind700Colors.map(c => ({ name: c.name, value: c.hex })))
    : (theme === "dark"
        ? tailwind200Colors.map(c => ({ name: c.name, value: c.hex }))
        : tailwind800Colors.map(c => ({ name: c.name, value: c.hex })))

  return (
    <div className="w-full overflow-x-auto">
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
              className="sticky left-0 top-0 z-30 h-8 px-1 text-left align-middle font-medium border-r min-w-[100px]"
              style={{ 
                backgroundColor: baseBg,
                color: theme === "dark" ? "#E4E4E7" : undefined,
                borderColor: borderColor
              }}
            >
              Color
            </th>
            <th 
              className="h-8 px-1 text-left align-middle font-medium min-w-[100px] border-l"
              style={{ 
                color: theme === "dark" ? "#E4E4E7" : undefined,
                borderColor: borderColor
              }}
            >
              Base Background
            </th>
            {highlights.map((highlight: { name: string; hex: string; opacity?: number }) => (
              <th 
                key={highlight.name} 
                className="h-8 px-1 text-left align-middle font-medium min-w-[100px] border-l"
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
          {colors.map((color: { name: string; value: string }) => {
            const textColorValue = color.value

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
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ 
                        backgroundColor: textColorValue,
                        borderColor: borderColor
                      }}
                    />
                    <span 
                      className="text-xs font-medium text-center"
                      style={{ color: theme === "dark" ? "#E4E4E7" : undefined }}
                    >
                      {color.name}
                    </span>
                  </div>
                </td>
                <td className="p-0 align-middle">
                  <ContrastCell
                    textColor={textColorValue}
                    backgroundColor={baseBg}
                    theme={theme}
                  />
                </td>
                {highlights.map((highlight: { name: string; hex: string; opacity?: number }) => (
                  <td key={highlight.name} className="p-0 align-middle">
                    <ContrastCell
                      textColor={textColorValue}
                      backgroundColor={baseBg}
                      theme={theme}
                      highlightHex={highlight.hex}
                      highlightOpacity={highlight.opacity}
                    />
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

