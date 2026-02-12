import { type ReactNode } from "react"
import { bodyTextColorForContainerBackground, type Theme } from "@/lib/utils"

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

export function DemoCard({
  backgroundColor,
  headingColor,
  title,
  children,
  theme,
  className = "",
}: DemoCardProps) {
  const borderColor = theme === "dark" ? "#3f3f46" : "#EBEBEB"
  const bodyColor = bodyTextColorForContainerBackground(backgroundColor, theme)

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
