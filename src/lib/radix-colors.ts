import * as radixColors from "@radix-ui/colors"

// Radix Colors level-11 values (text colors)
// These are the darkest colors in light scales and lightest in dark scales
export interface RadixColor {
  name: string
  light: string
  dark: string
}

export function getAllRadixLevel11Colors(): RadixColor[] {
  const colorPalettes = [
    "gray",
    "mauve",
    "slate",
    "sage",
    "olive",
    "sand",
    "tomato",
    "red",
    "ruby",
    "crimson",
    "pink",
    "plum",
    "purple",
    "violet",
    "iris",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "jade",
    "green",
    "grass",
    "brown",
    "orange",
    "amber",
    "yellow",
    "lime",
    "mint",
    "sky",
  ]

  const result: RadixColor[] = []

  for (const palette of colorPalettes) {
    const lightPalette = (radixColors as any)[palette]
    const darkPalette = (radixColors as any)[`${palette}Dark`]

    if (lightPalette && darkPalette) {
      const light11 = lightPalette[`${palette}11`]
      const dark11 = darkPalette[`${palette}11`]

      if (light11 && dark11) {
        result.push({
          name: palette.charAt(0).toUpperCase() + palette.slice(1),
          light: light11,
          dark: dark11,
        })
      }
    }
  }

  return result
}

// Get Radix level-4 colors (for both light and dark theme backgrounds)
export function getAllRadixLevel4Colors(): RadixColor[] {
  const colorPalettes = [
    "gray", "mauve", "slate", "sage", "olive", "sand",
    "tomato", "red", "ruby", "crimson", "pink", "plum",
    "purple", "violet", "iris", "indigo", "blue", "cyan",
    "teal", "jade", "green", "grass", "brown", "orange",
    "amber", "yellow", "lime", "mint", "sky",
  ]

  const result: RadixColor[] = []

  for (const palette of colorPalettes) {
    const lightPalette = (radixColors as any)[palette]
    const darkPalette = (radixColors as any)[`${palette}Dark`]

    if (lightPalette && darkPalette) {
      const light4 = lightPalette[`${palette}4`]
      const dark3 = darkPalette[`${palette}3`]

      if (light4 && dark3) {
        result.push({
          name: palette.charAt(0).toUpperCase() + palette.slice(1),
          light: light4,
          dark: dark3,
        })
      }
    }
  }

  return result
}

// Get Radix colors for a specific level (for background colors)
export function getAllRadixLevelColors(level: number): RadixColor[] {
  const colorPalettes = [
    "gray", "mauve", "slate", "sage", "olive", "sand",
    "tomato", "red", "ruby", "crimson", "pink", "plum",
    "purple", "violet", "iris", "indigo", "blue", "cyan",
    "teal", "jade", "green", "grass", "brown", "orange",
    "amber", "yellow", "lime", "mint", "sky",
  ]

  const result: RadixColor[] = []

  for (const palette of colorPalettes) {
    const lightPalette = (radixColors as any)[palette]
    const darkPalette = (radixColors as any)[`${palette}Dark`]

    if (lightPalette && darkPalette) {
      const lightValue = lightPalette[`${palette}${level}`]
      const darkValue = darkPalette[`${palette}${level}`]

      if (lightValue && darkValue) {
        result.push({
          name: palette.charAt(0).toUpperCase() + palette.slice(1),
          light: lightValue,
          dark: darkValue,
        })
      }
    }
  }

  return result
}

