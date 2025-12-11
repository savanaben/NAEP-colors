import * as wcagContrast from "wcag-contrast"

export interface ContrastResult {
  ratio: number
  aa: boolean
  aaa: boolean
  aaLarge: boolean
  aaaLarge: boolean
}

export function calculateContrast(
  foreground: string,
  background: string
): ContrastResult {
  const ratio = wcagContrast.hex(foreground, background)
  
  return {
    ratio,
    aa: ratio >= 4.5, // AA for normal text
    aaa: ratio >= 7, // AAA for normal text
    aaLarge: ratio >= 3, // AA for large text
    aaaLarge: ratio >= 4.5, // AAA for large text
  }
}

export function getComplianceLevel(result: ContrastResult): "Large text" | "Body text" | "AAA text" | "Fail" {
  const ratio = result.ratio
  if (ratio >= 7) return "AAA text" // >= 7:1
  if (ratio >= 4.5) return "Body text" // >= 4.5:1 and < 7:1
  if (ratio >= 3) return "Large text" // >= 3:1 and < 4.5:1
  return "Fail" // < 3:1
}

