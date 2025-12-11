import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Theme } from "@/lib/utils"

interface ThemeSelectorProps {
  value: Theme
  onValueChange: (value: Theme) => void
  theme: Theme
}

export function ThemeSelector({ value, onValueChange, theme }: ThemeSelectorProps) {
  const labelColor = theme === "dark" ? "#E4E4E7" : undefined

  return (
    <div className="flex items-center gap-2">
      <label 
        htmlFor="theme-select" 
        className="text-sm font-medium"
        style={{ color: labelColor }}
      >
        Theme:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id="theme-select" 
          className="w-[142px]"
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
            value="light"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Light
          </SelectItem>
          <SelectItem 
            value="beige"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Beige
          </SelectItem>
          <SelectItem 
            value="dark"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Dark
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

