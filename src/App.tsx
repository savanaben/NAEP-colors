import { useState, useEffect, useMemo } from "react"
import { ThemeSelector } from "@/components/ThemeSelector"
import { ColorSystemSelector, type ColorSystem } from "@/components/ColorSystemSelector"
import { QualitySelector, type Quality } from "@/components/QualitySelector"
import { ColorTable } from "@/components/ColorTable"
import { PassageDemo } from "@/components/PassageDemo"
import { type Theme, baseBackgrounds } from "@/lib/utils"
import "./index.css"

type Tab = "table" | "passage"

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme
    return saved || "light"
  })

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem("activeTab") as Tab
    return saved || "table"
  })

  const [colorSystem, setColorSystem] = useState<ColorSystem>(() => {
    const saved = localStorage.getItem("colorSystem")
    // Migrate old values
    if (saved === "tailwind") {
      return "tailwind700"
    }
    if (saved === "tailwind900") {
      return "tailwind700"
    }
    return (saved as ColorSystem) || "radix"
  })

  const [quality, setQuality] = useState<Quality>(() => {
    const saved = localStorage.getItem("quality") as Quality
    return saved || "normal"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem("colorSystem", colorSystem)
  }, [colorSystem])

  useEffect(() => {
    localStorage.setItem("quality", quality)
  }, [quality])

  // Calculate CSS filter based on quality level
  const qualityFilter = useMemo(() => {
    switch (quality) {
      case "low":
        // Slightly washed out with lower contrast and slight color cast
        return "saturate(0.85) contrast(0.9) brightness(1.05) hue-rotate(-3deg)"
      case "terrible":
        // More washed out, lower contrast, brighter, color cast, and slight blur
        return "saturate(0.75) contrast(0.85) brightness(1.1) hue-rotate(-5deg) blur(0.4px)"
      default:
        return "none"
    }
  }, [quality])

  const pageBg = baseBackgrounds[theme]
  const headerTextColor = theme === "dark" ? "#E4E4E7" : undefined
  const borderColor = theme === "dark" ? "#3f3f46" : undefined

  return (
    <div 
      style={{ 
        backgroundColor: pageBg, 
        minHeight: "100vh",
        filter: qualityFilter
      }}
    >
      <div 
        className="sticky top-0 z-40 border-b"
        style={{ 
          backgroundColor: pageBg,
          borderColor: borderColor
        }}
      >
        <div className="pt-4 px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <h1 
              className="text-2xl font-bold"
              style={{ color: headerTextColor }}
            >
              Color System Tester
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <ColorSystemSelector 
                value={colorSystem} 
                onValueChange={setColorSystem} 
                theme={theme} 
              />
              <ThemeSelector value={theme} onValueChange={setTheme} theme={theme} />
              <QualitySelector value={quality} onValueChange={setQuality} theme={theme} />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b" style={{ borderColor: borderColor }}>
            <button
              onClick={() => setActiveTab("table")}
              className="px-4 py-2 font-medium transition-colors"
              style={{
                color: activeTab === "table" 
                  ? (theme === "dark" ? "#E4E4E7" : "#262626")
                  : (theme === "dark" ? "#A1A1AA" : "#71717a"),
                borderBottom: activeTab === "table" ? "2px solid" : "none",
                borderColor: activeTab === "table" ? (theme === "dark" ? "#E4E4E7" : "#262626") : "transparent"
              }}
            >
              Color Analysis
            </button>
            <button
              onClick={() => setActiveTab("passage")}
              className="px-4 py-2 font-medium transition-colors"
              style={{
                color: activeTab === "passage" 
                  ? (theme === "dark" ? "#E4E4E7" : "#262626")
                  : (theme === "dark" ? "#A1A1AA" : "#71717a"),
                borderBottom: activeTab === "passage" ? "2px solid" : "none",
                borderColor: activeTab === "passage" ? (theme === "dark" ? "#E4E4E7" : "#262626") : "transparent"
              }}
            >
              Passage Demo
            </button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "table" && (
        <div className="p-4">
          <div 
            className="border rounded-lg overflow-hidden"
            style={{ 
              borderColor: borderColor
            }}
          >
            <ColorTable theme={theme} colorSystem={colorSystem} />
          </div>
        </div>
      )}

      {activeTab === "passage" && (
        <PassageDemo theme={theme} colorSystem={colorSystem} />
      )}
    </div>
  )
}

export default App

