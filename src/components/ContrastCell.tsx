import { calculateContrast, getComplianceLevel } from "@/lib/wcag"
import { Badge } from "@/components/ui/badge"
import { blendColor, baseBackgrounds, type Theme } from "@/lib/utils"

interface ContrastCellProps {
  textColor: string
  backgroundColor: string
  theme: Theme
  highlightHex?: string
  highlightOpacity?: number
  cellBackgroundOverride?: string
  /** When "SIP Highlight" or "Purple Highlight", a border is applied around the highlight area */
  highlightName?: string
}

export function ContrastCell({
  textColor,
  backgroundColor,
  theme,
  highlightHex,
  highlightOpacity,
  cellBackgroundOverride,
  highlightName,
}: ContrastCellProps) {
  // Allow callers to override the cell background; default to the theme base background
  const cellBackground = cellBackgroundOverride || baseBackgrounds[theme]
  
  // Text background is the highlight color (blended if opacity is specified)
  const textBackground =
    highlightHex && highlightOpacity !== undefined && highlightOpacity < 1
      ? blendColor(highlightHex, cellBackground, highlightOpacity)
      : highlightHex || backgroundColor

  // Calculate contrast between text color and the highlight background
  const contrastResult = calculateContrast(textColor, textBackground)
  const compliance = getComplianceLevel(contrastResult)

  // Determine badge variant based on compliance level
  const badgeVariant =
    compliance === "AAA text" ? "success" // >= 7:1
    : compliance === "Body text" ? "success" // >= 4.5:1 and < 7:1
    : compliance === "Large text" ? "warning" // >= 3:1 and < 4.5:1
    : "fail" // < 3:1

  // Theme-aware text colors
  const ratioTextColor = theme === "dark" ? "#A1A1AA" : undefined // medium gray for dark theme

  // Theme-aware badge styles
  const getBadgeStyle = () => {
    if (theme === "dark") {
      if (badgeVariant === "success") {
        return { backgroundColor: "rgba(34, 197, 94, 0.2)", color: "#4ade80" } // green
      } else if (badgeVariant === "warning") {
        return { backgroundColor: "rgba(234, 179, 8, 0.2)", color: "#facc15" } // yellow
      } else {
        return { backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#f87171" } // red
      }
    }
    return {} // use default light theme styles
  }

  const borderColor = theme === "dark" ? "#3f3f46" : undefined

  // SIP Highlight: dashed border around the highlight (light/beige vs dark border color)
  const isSipHighlight = highlightHex && highlightName === "SIP Highlight"
  const sipBorderStyle = isSipHighlight
    ? {
        borderWidth: "1px",
        borderStyle: "dashed" as const,
        borderRadius: "calc(4px * var(--zoom, 1))",
        borderColor: theme === "dark" ? "rgba(255, 255, 255, 0.24)" : "rgba(0, 0, 0, 0.36)",
      }
    : undefined

  // Purple Highlight: 1px solid border (light/beige #A12ECF, dark #DD90FF), no rounding
  const isPurpleHighlight = highlightHex && highlightName === "Purple Highlight"
  const purpleBorderStyle = isPurpleHighlight
    ? {
        borderWidth: "1px",
        borderStyle: "solid" as const,
        borderColor: theme === "dark" ? "#DD90FF" : "#A12ECF",
      }
    : undefined

  const highlightBorderStyle = sipBorderStyle ?? purpleBorderStyle

  return (
    <div
      className="p-1 min-w-[142px] gap-1 flex flex-col border"
      style={{ 
        backgroundColor: cellBackground,
        borderColor: borderColor
      }}
    >
      <div
        className="font-bold"
        style={{ 
          color: textColor,
          backgroundColor: textBackground,
          lineHeight: "1.3",
          fontSize: "22px",
          ...highlightBorderStyle,
        }}
      >
        Sample Text
      </div>
      <div className="flex items-center gap-2 flex-wrap mt-0.5">
        <span 
          className="text-sm font-mono font-semibold"
          style={{ color: ratioTextColor || undefined }}
        >
          {contrastResult.ratio.toFixed(2)}:1
        </span>
        <Badge 
          variant={badgeVariant} 
          className="text-sm"
          style={getBadgeStyle()}
        >
          {compliance}
        </Badge>
      </div>
    </div>
  )
}

