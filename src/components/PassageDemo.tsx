import { useState, useMemo, useEffect } from "react"
import { getAllRadixLevel11Colors, getAllRadixLevelColors } from "@/lib/radix-colors"
import { getAllTailwind700Colors, getAllTailwind800Colors, getAllTailwind200Colors, getAllTailwind300Colors, getAllTailwind50Colors, getAllTailwind950Colors, getAllTailwind100Colors, getAllTailwind900Colors } from "@/lib/tailwind-colors"
import { baseBackgrounds, type Theme } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"
import "./PassageDemo.css"

interface PassageDemoProps {
  theme: Theme
  colorSystem: ColorSystem
}

export function PassageDemo({ theme, colorSystem }: PassageDemoProps) {
  const radixColors = getAllRadixLevel11Colors()
  const tailwind700Colors = getAllTailwind700Colors()
  const tailwind800Colors = getAllTailwind800Colors()
  const tailwind200Colors = getAllTailwind200Colors()
  const tailwind300Colors = getAllTailwind300Colors()
  const tailwind50Colors = getAllTailwind50Colors()
  const tailwind100Colors = getAllTailwind100Colors()
  const tailwind950Colors = getAllTailwind950Colors()
  const tailwind900Colors = getAllTailwind900Colors()
  const baseBg = baseBackgrounds[theme]
  const textColor = theme === "dark" ? "dark" : "light"
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  // Determine available levels and default level based on color system and theme
  const { availableLevels, defaultLevelIndex } = useMemo(() => {
    if (colorSystem === "radix") {
      return {
        availableLevels: [2, 3, 4],
        defaultLevelIndex: 2 // level 4 is index 2 (default)
      }
    } else {
      // Tailwind
      if (theme === "dark") {
        return {
          availableLevels: [900, 950],
          defaultLevelIndex: 1 // 950 is index 1 (default)
        }
      } else {
        // light/beige
        if (colorSystem === "tailwind700") {
          return {
            availableLevels: [50, 100, 200],
            defaultLevelIndex: 1 // 100 is index 1 (default)
          }
        } else {
          return {
            availableLevels: [50, 100, 200],
            defaultLevelIndex: 0 // 50 is index 0 (default)
          }
        }
      }
    }
  }, [colorSystem, theme])

  const [selectedLevelIndex, setSelectedLevelIndex] = useState(defaultLevelIndex)
  const selectedLevel = availableLevels[selectedLevelIndex]

  // Reset to default level when color system or theme changes
  useEffect(() => {
    setSelectedLevelIndex(defaultLevelIndex)
  }, [defaultLevelIndex])

  // Get text colors based on selected system and theme
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

  // Get background colors based on selected system, theme, and level
  const bgColors = useMemo(() => {
    if (colorSystem === "radix") {
      const radixLevelColors = getAllRadixLevelColors(selectedLevel)
      return radixLevelColors.map(c => ({
        name: c.name,
        value: theme === "dark" ? c.dark : c.light
      }))
    } else {
      // Tailwind
      if (theme === "dark") {
        if (selectedLevel === 900) {
          return tailwind900Colors.map(c => ({ name: c.name, value: c.hex }))
        } else {
          return tailwind950Colors.map(c => ({ name: c.name, value: c.hex }))
        }
      } else {
        // light/beige
        if (selectedLevel === 50) {
          return tailwind50Colors.map(c => ({ name: c.name, value: c.hex }))
        } else if (selectedLevel === 100) {
          return tailwind100Colors.map(c => ({ name: c.name, value: c.hex }))
        } else {
          return tailwind200Colors.map(c => ({ name: c.name, value: c.hex }))
        }
      }
    }
  }, [colorSystem, theme, selectedLevel, tailwind50Colors, tailwind100Colors, tailwind200Colors, tailwind900Colors, tailwind950Colors])

  const getColorValue = (color: { name: string; value: string }) => {
    return color.value
  }

  const selectedColorObj = selectedColor 
    ? colors.find(c => getColorValue(c) === selectedColor)
    : null

  const passageTextColor = selectedColorObj 
    ? getColorValue(selectedColorObj)
    : (textColor === "dark" ? "#E4E4E7" : "#262626")

  // Get the corresponding background color for the selected text color
  const pageBgColor = useMemo(() => {
    if (!selectedColorObj) {
      return baseBg
    }
    
    // Find the matching background color by name
    const matchingBgColor = bgColors.find(c => c.name === selectedColorObj.name)
    return matchingBgColor ? matchingBgColor.value : baseBg
  }, [selectedColorObj, bgColors, baseBg])

  return (
    <div style={{ backgroundColor: pageBgColor, minHeight: "100vh" }}>
      {/* Sticky color swatch selector */}
      <div 
        className="sticky z-30 p-4 border-b"
        style={{ 
          backgroundColor: baseBg,
          borderColor: theme === "dark" ? "#3f3f46" : undefined,
          top: "115px" // Adjust based on header height
        }}
      >
        {/* Background level slider */}
        <div className="flex items-center gap-3 justify-center mb-4 max-w-[150px] mx-auto">
          <label 
            className="text-sm font-medium whitespace-nowrap"
            style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}
          >
            Passage Background:
          </label>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min="0"
              max={availableLevels.length - 1}
              value={selectedLevelIndex}
              onChange={(e) => setSelectedLevelIndex(Number(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                accentColor: theme === "dark" ? "#E4E4E7" : "#262626"
              }}
            />
            <span 
              className="text-sm font-mono min-w-[50px] text-right"
              style={{ color: theme === "dark" ? "#A1A1AA" : "#71717a" }}
            >
              {selectedLevel}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-center max-w-[750px] mx-auto">
          {colors.map((color) => {
            const colorValue = getColorValue(color)
            const isSelected = selectedColor === colorValue
            
            return (
              <button
                key={color.name}
                onClick={() => setSelectedColor(isSelected ? null : colorValue)}
                className="rounded border-2 transition-all hover:scale-110"
                style={{
                  width: "40px",
                  height: "40px",
                  backgroundColor: colorValue,
                  borderColor: isSelected 
                    ? (theme === "dark" ? "#E4E4E7" : "#262626")
                    : (theme === "dark" ? "#3f3f46" : undefined),
                  borderWidth: isSelected ? "3px" : "1px"
                }}
                title={color.name}
              />
            )
          })}
        </div>
      </div>

      {/* Passage content */}
      <div 
        className="passage-container px-12 py-12"
        style={{ backgroundColor: baseBg }}
      >
        <h2 style={{ color: passageTextColor }}>
          Understanding Color Contrast in Digital Design
        </h2>
        
        <div className="by-line" style={{ color: passageTextColor }}>
          By Design Team • March 2024
        </div>

        <p style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
          Color contrast plays a crucial role in ensuring that digital content is accessible to all users. 
          The Web Content Accessibility Guidelines (WCAG) provide specific contrast ratio requirements that 
          help designers create readable and inclusive interfaces. These guidelines ensure that text is 
          legible against its background, making content accessible to users with visual impairments.
        </p>

        <p style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
          When designing with color, it's important to test contrast ratios across different combinations. 
          A contrast ratio of 4.5:1 is the minimum for normal text, while large text requires at least 3:1. 
          For enhanced accessibility, aim for ratios of 7:1 or higher, which meet the AAA standard.
        </p>

        <h4 style={{ color: passageTextColor }}>
          Best Practices for Implementation
        </h4>

        <p style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
          Testing color combinations early in the design process helps prevent accessibility issues. 
          Use automated tools and manual testing to verify that all text meets WCAG standards. 
          Remember that contrast requirements apply not only to body text but also to headings, 
          links, and interactive elements.
        </p>
      </div>
    </div>
  )
}

