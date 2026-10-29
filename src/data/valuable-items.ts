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
}

export const VALUABLE_ITEMS: ValuableItemEntry[] = [
  { item: ValuableItem.Jewelry, dialogHeading: 'Total Value Of Your Jewelry' },
  { item: ValuableItem.Bicycles, dialogHeading: 'Total Value Of Your Bicycles' },
  {
    item: ValuableItem.Cameras,
    dialogHeading: 'Total Value Of Your Cameras And Lenses',
  },
  {
    item: ValuableItem.MusicalInstruments,
    dialogHeading: 'Total Value Of Your Instruments',
  },
  { item: ValuableItem.FineArt, dialogHeading: 'Total Value Of Your Fine Art' },
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
