import { getAllRadixLevel11Colors, getAllRadixLevelColors } from "@/lib/radix-colors"
import { applyRadixLightOverride } from "@/lib/radix-light-overrides"
import { reduceSaturation as reduceSaturationFn } from "@/lib/utils"
import { type ColorSystem } from "@/components/ColorSystemSelector"

export interface FinalColorRow {
  name: string
  textLight: string
  textDark: string
  bgLight: string
  bgDark: string
  accLight: string
  accDark: string
}

export function getFinalColorRows(
  colorSystem: ColorSystem,
  reduceSaturation: boolean,
  radixLightOverrides: boolean
): FinalColorRow[] {
  const isRadix = colorSystem === "radix11_3" || colorSystem === "radix11_4"
  if (!isRadix) return []

  const accentLevel = colorSystem === "radix11_4" ? 4 : 3
  const radix11 = getAllRadixLevel11Colors()
  const radixBgLight = getAllRadixLevelColors(3)
  const radixBgDark = getAllRadixLevelColors(4)
  const radixAccent = getAllRadixLevelColors(accentLevel)

  const minLightnessLight = 92
  const minLightnessDark = 11.5
  const skipSaturationDark = true

  return radix11.map((c) => {
    const name = c.name
    const textLight = applyRadixLightOverride(c.light, "light", colorSystem, radixLightOverrides)
    const textDark = c.dark

    const bgLightRaw = radixBgLight.find((x) => x.name === name)?.light ?? c.light
    const bgDarkRaw = radixBgDark.find((x) => x.name === name)?.dark ?? c.dark
    const bgLight = reduceSaturation
      ? reduceSaturationFn(bgLightRaw, 12, minLightnessLight, name, false)
      : bgLightRaw
    const bgDark = bgDarkRaw

    const accLightRaw = radixAccent.find((x) => x.name === name)?.light ?? c.light
    const accDarkRaw = radixAccent.find((x) => x.name === name)?.dark ?? c.dark
    const accLight = reduceSaturation
      ? reduceSaturationFn(accLightRaw, 12, minLightnessLight, name, false)
      : accLightRaw
    const accDark = reduceSaturation
      ? reduceSaturationFn(accDarkRaw, 12, minLightnessDark, name, skipSaturationDark)
      : accDarkRaw

    const textColorNone = ["Mauve", "Slate", "Sage", "Olive", "Sand"].includes(name)
    const finalTextLight = textColorNone ? "None" : textLight
    const finalTextDark = textColorNone ? "None" : textDark

    return {
      name,
      textLight: finalTextLight,
      textDark: finalTextDark,
      bgLight,
      bgDark,
      accLight,
      accDark,
    }
  })
}
