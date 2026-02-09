import { useState, useEffect, useMemo, useRef } from "react"
import { Trash2, FileText } from "lucide-react"
import { ThemeSelector } from "@/components/ThemeSelector"
import { ColorSystemSelector, type ColorSystem } from "@/components/ColorSystemSelector"
import { QualitySelector, type Quality } from "@/components/QualitySelector"
import { SaturationToggle } from "@/components/SaturationToggle"
import { RadixLightOverrideToggle } from "@/components/RadixLightOverrideToggle"
import { ColorTable } from "@/components/ColorTable"
import { PassageDemo } from "@/components/PassageDemo"
import { AccentColors } from "@/components/AccentColors"
import { BackgroundColors } from "@/components/BackgroundColors"
import { FinalColors } from "@/components/FinalColors"
import { type Theme, baseBackgrounds } from "@/lib/utils"
import "./index.css"

type Tab = "final" | "table" | "background" | "passage" | "accent"

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme") as Theme
    return saved || "light"
  })

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem("activeTab") as Tab
    const validTabs: Tab[] = ["final", "table", "background", "accent", "passage"]
    return validTabs.includes(saved) ? saved : "table"
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
    if (saved === "radix") {
      return "radix11_3" // Migrate old "radix" to "radix11_3"
    }
    return (saved as ColorSystem) || "radix11_3"
  })

  const [quality, setQuality] = useState<Quality>(() => {
    const saved = localStorage.getItem("quality") as Quality
    return saved || "normal"
  })

  const [reduceSaturation, setReduceSaturation] = useState<boolean>(() => {
    const saved = localStorage.getItem("reduceSaturation")
    if (saved === null) return true // Default to true on first load
    return saved === "true"
  })

  const [radixLightOverrides, setRadixLightOverrides] = useState<boolean>(() => {
    const saved = localStorage.getItem("radixLightOverrides")
    if (saved === null) return true // Default on (override enabled) on page load
    return saved === "true"
  })

  const [notesOpen, setNotesOpen] = useState(false)
  const notesRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    localStorage.setItem("reduceSaturation", reduceSaturation.toString())
  }, [reduceSaturation])

  useEffect(() => {
    localStorage.setItem("radixLightOverrides", radixLightOverrides.toString())
  }, [radixLightOverrides])

  // Close notes popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notesRef.current && !notesRef.current.contains(event.target as Node)) {
        setNotesOpen(false)
      }
    }

    if (notesOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [notesOpen])

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

  const handleClearStorage = () => {
    if (confirm("Clear all saved preferences? This will reset theme, color system, quality, tab selection, and toggles.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h1 
              className="text-2xl font-bold"
              style={{ color: headerTextColor }}
            >
              Color Tester
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex items-center gap-2" ref={notesRef}>
                <button
                  onClick={() => setNotesOpen(!notesOpen)}
                  className="p-1.5 rounded transition-colors"
                  style={{
                    color: theme === "dark" ? "#A1A1AA" : "#71717a",
                    backgroundColor: notesOpen ? (theme === "dark" ? "#27272a" : "#f4f4f5") : "transparent"
                  }}
                  onMouseEnter={(e) => {
                    if (!notesOpen) {
                      e.currentTarget.style.backgroundColor = theme === "dark" ? "#27272a" : "#f4f4f5"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notesOpen) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                  title="Notes"
                >
                  <FileText className="w-4 h-4" />
                </button>
                {notesOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-[600px] p-4 rounded-lg border shadow-lg z-50"
                    style={{
                      backgroundColor: theme === "dark" ? "#27272a" : "#ffffff",
                      borderColor: theme === "dark" ? "#3f3f46" : "#e4e4e7",
                      color: theme === "dark" ? "#E4E4E7" : "#262626"
                    }}
                  >
                    <h3 className="font-semibold mb-3 text-sm">Notes</h3>
                    <ul className="space-y-3 text-sm list-disc pl-5">
                    <li className="leading-relaxed">
                        No SIP on any bg color to ensure border contrast maintained. 
                      </li>
                      <li className="leading-relaxed">
                        Is it excessive to use radix 3 dark for sidebars and raddix 4 dark for bg colors. the rationale for this is a darker background color for containers becomes less perceptable (BUT for sidebars we want this less perceptable level because the color field is so large).
                      </li>
                      <li className="leading-relaxed">
                        We accept LBB highlight can be somewhat impacted on a blue bg. LBB highlight is not contrast compliant to start... we had a whole project to address this but it was descoped. 
                      </li>
                       <li className="leading-relaxed">
                        Change - LBB highlight moves from transparent to solid. this fixes contrast issues with dark theme off white body text on a colored background.
                      </li>
                      <li className="leading-relaxed">
                        Remove all the grays/decide on 1 gray and remove the rest. an issue with gray is the dark theme - headers seem sort of too dark/gray compared to white body text. 
                      </li>
                      <li className="leading-relaxed">
                        Radix Yellow light/beige sidebar color might be too vibrant.
                      </li>
                      <li className="leading-relaxed">
                        How do we reconcile allowing all of these container colors. Current rule was background colors can only be used for asides/smaller chunks of text. 
                      </li>
                      <li className="leading-relaxed">
                        Light theme "Tomato", "Red", "Ruby" is very red - we alright with red header text?
                      </li>
                    </ul>
                  </div>
                )}
                <button
                  onClick={handleClearStorage}
                  className="p-1.5 rounded transition-colors"
                  style={{
                    color: theme === "dark" ? "#A1A1AA" : "#71717a",
                    backgroundColor: "transparent"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === "dark" ? "#27272a" : "#f4f4f5"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                  title="Clear storage"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <ColorSystemSelector 
                  value={colorSystem} 
                  onValueChange={setColorSystem} 
                  theme={theme} 
                />
              </div>
              <ThemeSelector value={theme} onValueChange={setTheme} theme={theme} />
              <QualitySelector value={quality} onValueChange={setQuality} theme={theme} />
              <SaturationToggle value={reduceSaturation} onValueChange={setReduceSaturation} theme={theme} />
              <RadixLightOverrideToggle value={radixLightOverrides} onValueChange={setRadixLightOverrides} theme={theme} />
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 border-b" style={{ borderColor: borderColor }}>
            <button
              onClick={() => setActiveTab("final")}
              className="px-4 py-2 font-medium transition-colors"
              style={{
                color: activeTab === "final" 
                  ? (theme === "dark" ? "#E4E4E7" : "#262626")
                  : (theme === "dark" ? "#A1A1AA" : "#71717a"),
                borderBottom: activeTab === "final" ? "2px solid" : "none",
                borderColor: activeTab === "final" ? (theme === "dark" ? "#E4E4E7" : "#262626") : "transparent"
              }}
            >
              Final Colors
            </button>
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
              Text Color Analysis
            </button>
            <button
              onClick={() => setActiveTab("background")}
              className="px-4 py-2 font-medium transition-colors"
              style={{
                color: activeTab === "background" 
                  ? (theme === "dark" ? "#E4E4E7" : "#262626")
                  : (theme === "dark" ? "#A1A1AA" : "#71717a"),
                borderBottom: activeTab === "background" ? "2px solid" : "none",
                borderColor: activeTab === "background" ? (theme === "dark" ? "#E4E4E7" : "#262626") : "transparent"
              }}
            >
              Background Colors
            </button>
            <button
              onClick={() => setActiveTab("accent")}
              className="px-4 py-2 font-medium transition-colors"
              style={{
                color: activeTab === "accent" 
                  ? (theme === "dark" ? "#E4E4E7" : "#262626")
                  : (theme === "dark" ? "#A1A1AA" : "#71717a"),
                borderBottom: activeTab === "accent" ? "2px solid" : "none",
                borderColor: activeTab === "accent" ? (theme === "dark" ? "#E4E4E7" : "#262626") : "transparent"
              }}
            >
              Accent Colors
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
      {activeTab === "final" && (
        <FinalColors theme={theme} colorSystem={colorSystem} reduceSaturation={reduceSaturation} radixLightOverrides={radixLightOverrides} />
      )}

      {activeTab === "table" && (
        <div className="p-4">
          <div 
            className="border rounded-lg overflow-hidden"
            style={{ 
              borderColor: borderColor
            }}
          >
            <ColorTable theme={theme} colorSystem={colorSystem} radixLightOverrides={radixLightOverrides} />
          </div>
        </div>
      )}

      {activeTab === "background" && (
        <div className="p-4">
          <BackgroundColors theme={theme} colorSystem={colorSystem} reduceSaturation={reduceSaturation} radixLightOverrides={radixLightOverrides} />
        </div>
      )}

      {activeTab === "passage" && (
        <PassageDemo theme={theme} colorSystem={colorSystem} reduceSaturation={reduceSaturation} radixLightOverrides={radixLightOverrides} />
      )}

      {activeTab === "accent" && (
        <div className="p-4">
          <div 
            className="border rounded-lg overflow-hidden"
            style={{ 
              borderColor: borderColor
            }}
          >
            <AccentColors theme={theme} colorSystem={colorSystem} reduceSaturation={reduceSaturation} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App

