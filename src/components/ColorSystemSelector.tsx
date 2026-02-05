import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Theme } from "@/lib/utils"

export type ColorSystem = "radix11_3" | "radix11_4" | "tailwind700" | "tailwind800"

interface ColorSystemSelectorProps {
  value: ColorSystem
  onValueChange: (value: ColorSystem) => void
  theme: Theme
}

export function ColorSystemSelector({ value, onValueChange, theme }: ColorSystemSelectorProps) {
  const labelColor = theme === "dark" ? "#E4E4E7" : undefined

  return (
    <div className="flex items-center gap-2">
      <label 
        htmlFor="color-system-select" 
        className="text-sm font-medium"
        style={{ color: labelColor }}
      >
        Color System:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id="color-system-select" 
          className="w-[160px]"
          style={{
            backgroundColor: theme === "dark" ? "#27272a" : undefined,
            color: theme === "dark" ? "#E4E4E7" : undefined,
            borderColor: theme === "dark" ? "#3f3f46" : undefined
          }}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent
          style={{
            backgroundColor: theme === "dark" ? "#27272a" : undefined,
            borderColor: theme === "dark" ? "#3f3f46" : undefined
          }}
        >
          <SelectItem 
            value="radix11_3"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Radix 11/3
          </SelectItem>
          <SelectItem 
            value="radix11_4"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Radix 11/4
          </SelectItem>
          <SelectItem 
            value="tailwind700"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Tailwind 700/300
          </SelectItem>
          <SelectItem 
            value="tailwind800"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Tailwind 800/200
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

