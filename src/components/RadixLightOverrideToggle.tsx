import { type Theme } from "@/lib/utils"

interface RadixLightOverrideToggleProps {
  value: boolean
  onValueChange: (value: boolean) => void
  theme: Theme
}

export function RadixLightOverrideToggle({ value, onValueChange, theme }: RadixLightOverrideToggleProps) {
  const labelColor = theme === "dark" ? "#E4E4E7" : undefined
  const toggleBg = value
    ? (theme === "dark" ? "#3b82f6" : "#3b82f6")
    : (theme === "dark" ? "#3f3f46" : "#d1d5db")
  const toggleBgHover = value
    ? (theme === "dark" ? "#2563eb" : "#2563eb")
    : (theme === "dark" ? "#52525b" : "#9ca3af")
  const thumbBg = theme === "dark" ? "#ffffff" : "#ffffff"
  const borderColor = theme === "dark" ? "#3f3f46" : "#d1d5db"

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="radix-light-override-toggle"
        className="text-sm font-medium"
        style={{ color: labelColor, cursor: "pointer" }}
      >
        Radix Light Overrides:
      </label>
      <button
        id="radix-light-override-toggle"
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onValueChange(!value)}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{
          backgroundColor: toggleBg,
          border: `1px solid ${borderColor}`,
          cursor: "pointer"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = toggleBgHover
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
