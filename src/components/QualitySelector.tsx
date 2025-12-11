import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type Theme } from "@/lib/utils"

export type Quality = "normal" | "low" | "terrible"

interface QualitySelectorProps {
  value: Quality
  onValueChange: (value: Quality) => void
  theme: Theme
}

export function QualitySelector({ value, onValueChange, theme }: QualitySelectorProps) {
  const labelColor = theme === "dark" ? "#E4E4E7" : undefined

  return (
    <div className="flex items-center gap-2">
      <label 
        htmlFor="quality-select" 
        className="text-sm font-medium"
        style={{ color: labelColor }}
      >
        Low Quality Mode:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger 
          id="quality-select" 
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
            value="normal"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Normal
          </SelectItem>
          <SelectItem 
            value="low"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Low
          </SelectItem>
          <SelectItem 
            value="terrible"
            style={{
              color: theme === "dark" ? "#E4E4E7" : undefined
            }}
          >
            Terrible
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

