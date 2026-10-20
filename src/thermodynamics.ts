export type Phase = 'solid' | 'liquid' | 'gas'

export type Substance = {
  id: string
  name: string
  formula: string
  meltingPoint: number
  normalBoilingPoint: number
  heatOfVaporization: number
  minTemperature: number
  maxTemperature: number
  color: string
}

export const substances: Substance[] = [
  {
    id: 'water',
    name: 'Água',
    formula: 'H₂O',
    meltingPoint: 0,
    normalBoilingPoint: 100,
    heatOfVaporization: 40.65,
    minTemperature: -40,
    maxTemperature: 350,
    color: '#77c8e9',
  },
  {
    id: 'ethanol',
    name: 'Etanol',
    formula: 'C₂H₆O',
    meltingPoint: -114,
    normalBoilingPoint: 78.37,
    heatOfVaporization: 38.56,
    minTemperature: -120,
    maxTemperature: 220,
    color: '#c0a4ef',
  },
  {
    id: 'acetone',
    name: 'Acetona',
    formula: 'C₃H₆O',
    meltingPoint: -94.7,
    normalBoilingPoint: 56.05,
    heatOfVaporization: 29.1,
    minTemperature: -100,
    maxTemperature: 180,
    color: '#f4bb72',
  },
]

export const MIN_PRESSURE = 0.25
export const MAX_PRESSURE = 8

const GAS_CONSTANT = 8.314

export function boilingPointAtPressure(substance: Substance, pressureAtm: number) {
  const safePressure = Math.min(MAX_PRESSURE, Math.max(MIN_PRESSURE, pressureAtm))
  const normalBoilingKelvin = substance.normalBoilingPoint + 273.15
  const inverseBoilingKelvin =
    1 / normalBoilingKelvin -
    (GAS_CONSTANT / (substance.heatOfVaporization * 1000)) * Math.log(safePressure)
  return 1 / inverseBoilingKelvin - 273.15
}

export function getPhase(
  temperature: number,
  meltingPoint: number,
  boilingPoint: number,
): Phase {
  if (temperature <= meltingPoint) return 'solid'
  if (temperature >= boilingPoint) return 'gas'
  return 'liquid'
}

export function formatTemperature(value: number) {
  return `${Number.isInteger(value) ? value : value.toFixed(1)} °C`
}
