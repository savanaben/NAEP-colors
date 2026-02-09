import { type ReactNode } from "react"
import { getGrayscaleLightness } from "@/lib/utils"
import { type Theme } from "@/lib/utils"

export interface DemoCardProps {
  /** Background color of the card */
  backgroundColor: string
  /** Color for the h4 heading only */
  headingColor: string
  /** Heading text */
  title: string
  /** Body content; text color is derived from background for readability */
  children: ReactNode
  theme: Theme
  /** Optional class for the card container (e.g. mt-6, mt-4) */
  className?: string
}

function bodyColorForBackground(backgroundColor: string, theme: Theme): string {
  if (backgroundColor === "transparent") {
    return theme === "dark" ? "#EBEBEB" : "#262626"
  }
  return getGrayscaleLightness(backgroundColor) > 50 ? "#262626" : "#EBEBEB"
}

export function DemoCard({
  backgroundColor,
  headingColor,
  title,
  children,
  theme,
  className = "",
}: DemoCardProps) {
  const borderColor = theme === "dark" ? "#3f3f46" : "#EBEBEB"
  const bodyColor = bodyColorForBackground(backgroundColor, theme)

  return (
    <div
      className={`p-4 rounded-xl border ${className}`.trim()}
      style={{
        backgroundColor,
        borderColor,
        fontFamily: "Calibri, sans-serif",
      }}
    >
      <h4
        style={{
          color: headingColor,
          marginBottom: "8px",
          marginTop: 0,
          fontSize: "36px",
          fontWeight: "bold",
          lineHeight: 1.1,
        }}
      >
        {title}
      </h4>
      <p
        style={{
          color: bodyColor,
          margin: 0,
          fontSize: "24px",
          lineHeight: 1.4,
        }}
      >
        {children}
      </p>
    </div>
  )
}
