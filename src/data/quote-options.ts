export enum Coverage {
  PersonalProperty = 'Personal Property',
  PersonalLiability = 'Personal Liability',
  LossOfUse = 'Loss of use',
  MedicalPayments = 'Medical payments to others',
}

export type CoverageStart = {
  name: Coverage
  startsAt: 'min' | 'max'
}

export const COVERAGES: CoverageStart[] = [
  { name: Coverage.PersonalProperty, startsAt: 'max' },
  { name: Coverage.PersonalLiability, startsAt: 'min' },
  { name: Coverage.LossOfUse, startsAt: 'min' },
  { name: Coverage.MedicalPayments, startsAt: 'min' },
]

export const DEDUCTIBLES: number[] = [250, 500, 1_000, 2_500]

export const DEFAULT_DEDUCTIBLE = 500

export enum ValuableItem {
  Jewelry = 'jewelry',
  Bicycles = 'bicycles',
  Cameras = 'cameras',
  MusicalInstruments = 'musical instruments',
  FineArt = 'fine art',
}

export type ValuableItemEntry = {
  item: ValuableItem
  dialogHeading: string
  hasNotice: boolean
}

export const VALUABLE_ITEMS: ValuableItemEntry[] = [
  { item: ValuableItem.Jewelry, dialogHeading: 'Total Value Of Your Jewelry', hasNotice: true },
  { item: ValuableItem.Bicycles, dialogHeading: 'Total Value Of Your Bicycles', hasNotice: true },
  {
    item: ValuableItem.Cameras,
    dialogHeading: 'Total Value Of Your Cameras And Lenses',
    hasNotice: true,
  },
  {
    item: ValuableItem.MusicalInstruments,
    dialogHeading: 'Total Value Of Your Instruments',
    hasNotice: true,
  },
  { item: ValuableItem.FineArt, dialogHeading: 'Total Value Of Your Fine Art', hasNotice: true },
]

export const DEFAULT_VALUABLE_VALUE = 1_000

export const VALUABLE_VALUE_STEP = 1_000

export function valuableItemEntry(item: ValuableItem): ValuableItemEntry {
  const entry = VALUABLE_ITEMS.find((e) => e.item === item)
  if (!entry) {
    throw new Error(`No valuable item entry for "${item}"`)
  }
  return entry
}
