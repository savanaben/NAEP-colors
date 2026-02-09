import { useState } from "react"
import { AlertTriangle, ChevronDown, ChevronRight } from "lucide-react"
import { type Theme } from "@/lib/utils"

interface BackgroundColorRulesAccordionProps {
  theme: Theme
  className?: string
}

const BORDER = "#e4e4e7"
const BORDER_DARK = "#3f3f46"
const LINK_BLUE = "#1e40af"
const LINK_BLUE_HOVER = "#2563eb"

export function BackgroundColorRulesAccordion({ theme, className = "" }: BackgroundColorRulesAccordionProps) {
  const [open, setOpen] = useState(false)
  const borderColor = theme === "dark" ? BORDER_DARK : BORDER
  const headerFg = theme === "dark" ? "#E4E4E7" : "#262626"
  const subFg = theme === "dark" ? "#A1A1AA" : "#71717a"

  return (
    <div className={`mb-2 ${className}`.trim()}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm w-full text-left rounded py-1 hover:underline underline-offset-2"
        style={{
          color: LINK_BLUE,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = LINK_BLUE_HOVER
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = LINK_BLUE
        }}
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: "#cc9b00" }} />
        {open ? (
          <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "inherit" }} />
        ) : (
          <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "inherit" }} />
        )}
        <span>Background Color usage rules</span>
      </button>
      {open && (
        <div
          className="mt-1.5 pl-4 text-sm border-l-2 space-y-1"
          style={{ color: subFg, borderColor }}
        >
          <ul className="list-disc pl-4 space-y-0.5">
            <li>Don&apos;t place SIP highlights on any background color.</li>
            <li>Don&apos;t place LBB highlights on blue background colors (Indigo, Blue, Cyan, Teal, Sky).</li>
            <li>Avoid sustained reading on background colors (limit 1-2 paragraphs of body text over a background color).</li>
          </ul>
        </div>
      )}
    </div>
  )
}
