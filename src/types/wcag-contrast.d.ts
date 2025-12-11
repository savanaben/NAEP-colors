declare module "wcag-contrast" {
  export function hex(foreground: string, background: string): number
  export function rgb(foreground: [number, number, number], background: [number, number, number]): number
  export function score(ratio: number): "Fail" | "AA Large" | "AA" | "AAA"
  export function luminance(luminance1: number, luminance2: number): number
}

