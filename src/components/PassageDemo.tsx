import { useState, useMemo, useEffect } from "react"
import { getAllRadixLevel11Colors, getAllRadixLevelColors } from "@/lib/radix-colors"
import { getAllTailwind700Colors, getAllTailwind800Colors, getAllTailwind200Colors, getAllTailwind300Colors, getAllTailwind50Colors, getAllTailwind950Colors, getAllTailwind100Colors, getAllTailwind900Colors } from "@/lib/tailwind-colors"
import { baseBackgrounds, type Theme, reduceSaturation as reduceSaturationFn } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"
import "./PassageDemo.css"

interface PassageDemoProps {
  theme: Theme
  colorSystem: ColorSystem
  reduceSaturation: boolean
}

export function PassageDemo({ theme, colorSystem, reduceSaturation }: PassageDemoProps) {
  const radixColors = getAllRadixLevel11Colors()
  const radix5LightColors = useMemo(
    () => getAllRadixLevelColors(5).map(c => ({ name: c.name, light: c.light })),
    []
  )
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
  
  // Get text colors based on selected system and theme
  const colors = useMemo(() => {
    return (colorSystem === "radix11_3" || colorSystem === "radix11_4")
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
  }, [colorSystem, theme, textColor])

  // Initialize selectedColor from localStorage, keyed by colorSystem only (not theme)
  const [selectedColor, setSelectedColor] = useState<string | null>(() => {
    const storageKey = `passageSelectedColor_${colorSystem}`
    const savedColorName = localStorage.getItem(storageKey)
    if (savedColorName) {
      // Find the color by name in the current color list
      const colorObj = colors.find(c => c.name === savedColorName)
      return colorObj ? colorObj.value : null
    }
    return null
  })

  // Sync selectedColor when colorSystem or theme changes (find by name, not hex)
  useEffect(() => {
    const storageKey = `passageSelectedColor_${colorSystem}`
    const savedColorName = localStorage.getItem(storageKey)
    
    if (savedColorName) {
      // Find the color by name in the current color list
      const colorObj = colors.find(c => c.name === savedColorName)
      if (colorObj) {
        setSelectedColor(colorObj.value)
      } else {
        // Color no longer exists, clear it
        setSelectedColor(null)
        localStorage.removeItem(storageKey)
      }
    } else {
      // No saved color for this color system - clear selection
      setSelectedColor(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorSystem, theme]) // Sync when colorSystem or theme changes

  // Save selectedColor name to localStorage when it changes
  useEffect(() => {
    const storageKey = `passageSelectedColor_${colorSystem}`
    if (selectedColor) {
      // Find the color object to get the name
      const colorObj = colors.find(c => c.value === selectedColor)
      if (colorObj) {
        localStorage.setItem(storageKey, colorObj.name)
      }
    } else {
      localStorage.removeItem(storageKey)
    }
  }, [selectedColor, colorSystem, colors])

  // Determine available levels and default level based on color system and theme
  const { availableLevels, defaultLevelIndex } = useMemo(() => {
    if (colorSystem === "radix11_3" || colorSystem === "radix11_4") {
      return {
        availableLevels: [2, 3, 4],
        defaultLevelIndex: colorSystem === "radix11_3" ? 1 : 2 // level 3 is index 1, level 4 is index 2
      }
    } else {
      // Tailwind
      if (theme === "dark") {
        return {
          availableLevels: [900, 950],
          defaultLevelIndex: 1 // 950 is index 1 (default)
        }
      } else {
        // light/beige - both tailwind700 and tailwind800 default to 100
        return {
          availableLevels: [50, 100, 200],
          defaultLevelIndex: 1 // 100 is index 1 (default)
        }
      }
    }
  }, [colorSystem, theme])

  const [selectedLevelIndex, setSelectedLevelIndex] = useState(defaultLevelIndex)
  const selectedLevel = availableLevels[selectedLevelIndex]

  // Precompute Radix backgrounds for both light and dark variants (used in dual containers)
  // Light uses selectedLevel (default 3), dark always uses level 4
  // Dark (level 4) is never adjusted by the toggle - always raw
  const radixBackgroundPairs = useMemo(() => {
    if (colorSystem !== "radix11_3" && colorSystem !== "radix11_4") return null
    const lightLevel = selectedLevel
    const darkLevel = 4
    const lightColors = getAllRadixLevelColors(lightLevel)
    const darkColors = getAllRadixLevelColors(darkLevel)
    return lightColors.map(c => {
      const darkMatch = darkColors.find(d => d.name === c.name)
      return {
        name: c.name,
        light: reduceSaturation
          ? reduceSaturationFn(c.light, 12, 92, c.name, false)
          : c.light,
        dark: darkMatch ? darkMatch.dark : c.light, // Dark always raw, no adjustment
      }
    })
  }, [colorSystem, selectedLevel, reduceSaturation])

  // Reset to default level when color system or theme changes
  useEffect(() => {
    setSelectedLevelIndex(defaultLevelIndex)
  }, [defaultLevelIndex])

  // Get background colors based on selected system, theme, and level
  const bgColors = useMemo(() => {
    let colors
    if (colorSystem === "radix11_3" || colorSystem === "radix11_4") {
      const radixLevelColors = getAllRadixLevelColors(selectedLevel)
      colors = radixLevelColors.map(c => ({
        name: c.name,
        value: theme === "dark" ? c.dark : c.light
      }))
    } else {
      // Tailwind
      if (theme === "dark") {
        if (selectedLevel === 900) {
          colors = tailwind900Colors.map(c => ({ name: c.name, value: c.hex }))
        } else {
          colors = tailwind950Colors.map(c => ({ name: c.name, value: c.hex }))
        }
      } else {
        // light/beige
        if (selectedLevel === 50) {
          colors = tailwind50Colors.map(c => ({ name: c.name, value: c.hex }))
        } else if (selectedLevel === 100) {
          colors = tailwind100Colors.map(c => ({ name: c.name, value: c.hex }))
        } else {
          colors = tailwind200Colors.map(c => ({ name: c.name, value: c.hex }))
        }
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
  }, [colorSystem, theme, selectedLevel, tailwind50Colors, tailwind100Colors, tailwind200Colors, tailwind900Colors, tailwind950Colors, reduceSaturation])

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

  // Light/dark demo containers backgrounds (static to theme)
  const lightDemoBg = useMemo(() => {
    if (!selectedColorObj || !radixBackgroundPairs) return baseBg
    const match = radixBackgroundPairs.find(c => c.name === selectedColorObj.name)
    return match ? match.light : baseBg
  }, [selectedColorObj, radixBackgroundPairs, baseBg])

  const darkDemoBg = useMemo(() => {
    if (!selectedColorObj || !radixBackgroundPairs) return "#000000"
    const match = radixBackgroundPairs.find(c => c.name === selectedColorObj.name)
    return match ? match.dark : "#000000"
  }, [selectedColorObj, radixBackgroundPairs])

  // Dark heading color should always use the dark variant of the selected accent (or default)
  const darkHeadingColor = useMemo(() => {
    if (selectedColorObj && radix5LightColors) {
      const match = radix5LightColors.find(c => c.name === selectedColorObj.name)
      if (match) {
        return match.light
      }
    }
    return "#E4E4E7"
  }, [selectedColorObj, radix5LightColors])

  const lightHeadingColor = useMemo(() => {
    if (selectedColorObj && radixColors) {
      const match = radixColors.find(c => c.name === selectedColorObj.name)
      if (match) {
        return match.light
      }
    }
    return "#262626"
  }, [selectedColorObj, radixColors])

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
        {/* Background level slider - hidden */}
        {/* <div className="flex items-center gap-3 justify-center mb-4 max-w-[150px] mx-auto">
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
        </div> */}
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

        {/* Light background container (Radix light, adjusted toggle applied) */}
        <div
          className="mt-6 p-4 rounded-xl border"
          style={{
            backgroundColor: lightDemoBg,
            borderColor: theme === "dark" ? "#3f3f46" : "#e4e4e7"
          }}
        >
          <h4 style={{ color: lightHeadingColor, marginBottom: "8px", marginTop: 0 }}>
            Light Colored Container
          </h4>
          <p style={{ color: "#262626", margin: 0 }}>
            This block uses the light Radix accent background (level {selectedLevel}) with optional adjustment.
            Heading keeps the accent text color; body uses standard dark text for readability.
          </p>
        </div>

        {/* Dark background container (Radix dark rendered in light/beige theme) */}
        <div
          className="mt-4 p-4 rounded-xl border"
          style={{
            backgroundColor: darkDemoBg,
            borderColor: theme === "dark" ? "#3f3f46" : "#e4e4e7"
          }}
        >
          <h4 style={{ color: darkHeadingColor, marginBottom: "8px", marginTop: 0 }}>
            Dark Colored Container
          </h4>
          <p style={{ color: "#E4E4E7", margin: 0 }}>
            This block shows the dark Radix accent background (level {selectedLevel}) inside the light/beige page.
            Heading keeps the accent text color; body uses light text for contrast.
          </p>
        </div>

        <h4 style={{ color: passageTextColor }}>
          Best Practices for Implementation
        </h4>

        <p style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
          Testing color combinations early in the design process helps prevent accessibility issues. 
          Use automated tools and manual testing to verify that all text meets WCAG standards. 
          Remember that contrast requirements apply not only to body text but also to headings, 
          links, and interactive elements.
        </p>
        <p style={{ color: theme === "dark" ? "#E4E4E7" : "#262626" }}>
          Testing color combinations early in the design process helps prevent accessibility issues. 
          Use automated tools and manual testing to verify that all text meets WCAG standards. 
          Remember that contrast requirements apply.
        </p>
      </div>
    </div>
  )
}

