import { type Theme } from "@/lib/utils"

interface SaturationToggleProps {
  value: boolean
  onValueChange: (value: boolean) => void
  theme: Theme
}

export function SaturationToggle({ value, onValueChange, theme }: SaturationToggleProps) {
  const isDisabled = false // Enable for all themes now
  const labelColor = theme === "dark" ? "#E4E4E7" : undefined
  const toggleBg = isDisabled
    ? "#27272a"
    : (value 
      ? (theme === "dark" ? "#3b82f6" : "#3b82f6")
      : (theme === "dark" ? "#3f3f46" : "#d1d5db"))
  const toggleBgHover = isDisabled
    ? toggleBg
    : (value
      ? (theme === "dark" ? "#2563eb" : "#2563eb")
      : (theme === "dark" ? "#52525b" : "#9ca3af"))
  const thumbBg = theme === "dark" ? "#ffffff" : "#ffffff"
  const borderColor = theme === "dark" ? "#3f3f46" : "#d1d5db"

  return (
    <div className="flex items-center gap-2">
      <label 
        htmlFor="saturation-toggle" 
        className="text-sm font-medium"
        style={{ 
          color: labelColor,
          cursor: isDisabled ? "not-allowed" : "pointer",
          opacity: isDisabled ? 0.5 : 1
        }}
      >
        Adjusted Accent Colors:
      </label>
      <button
        id="saturation-toggle"
        type="button"
        role="switch"
        aria-checked={value}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        onClick={() => {
          if (!isDisabled) {
            onValueChange(!value)
          }
        }}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: toggleBg,
          border: `1px solid ${borderColor}`,
          cursor: isDisabled ? "not-allowed" : "pointer"
        }}
        onMouseEnter={(e) => {
          if (!isDisabled) {
            e.currentTarget.style.backgroundColor = toggleBgHover
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = toggleBg
        }}
      >
        <span
          className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
          style={{
            transform: value ? "translateX(22px)" : "translateX(2px)",
            backgroundColor: thumbBg
          }}
        />
      </button>
    </div>
  )
}

