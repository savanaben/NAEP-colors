import { calculateContrast, getComplianceLevel } from "@/lib/wcag"
import { Badge } from "@/components/ui/badge"
import { blendColor, baseBackgrounds, type Theme } from "@/lib/utils"

interface ContrastCellProps {
  textColor: string
  backgroundColor: string
  theme: Theme
  highlightHex?: string
  highlightOpacity?: number
}

export function ContrastCell({
  textColor,
  backgroundColor,
  theme,
  highlightHex,
  highlightOpacity,
}: ContrastCellProps) {
  // Cell background is always the theme's base background
  const cellBackground = baseBackgrounds[theme]
  
  // Text background is the highlight color (blended if opacity is specified)
  const textBackground =
    highlightHex && highlightOpacity !== undefined && highlightOpacity < 1
      ? blendColor(highlightHex, baseBackgrounds[theme], highlightOpacity)
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
          lineHeight: "1.2",
          fontSize: "22px"
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

