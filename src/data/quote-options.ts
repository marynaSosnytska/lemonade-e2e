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

export enum AddonKey {
  InterestedParty = 'interested_party',
  Spouse = 'secondary_insured',
  SignificantOther = 'other_members_of_household',
  WaterBackup = 'water_backup',
  LandlordPropertyDamage = 'landlord_property_damage',
  EquipmentBreakdown = 'equipment_breakdown',
}

export type FormValues = Record<string, string>

export type Addon = {
  key: AddonKey
  heading: string
  pricing: 'free' | 'paid'
  dialogHeading?: string
  formValues?: FormValues
}

export const ADDONS: Addon[] = [
  {
    key: AddonKey.InterestedParty,
    heading: 'Interested party/Landlord',
    pricing: 'free',
    dialogHeading: 'add an interested party',
    formValues: { Name: 'Acme Properties', Address: '1 Main St', Email: 'landlord@example.com' },
  },
  {
    key: AddonKey.Spouse,
    heading: 'Spouse',
    pricing: 'free',
    dialogHeading: 'Add your spouse',
    formValues: { 'First name': 'Jane', 'Last name': 'Doe' },
  },
  {
    key: AddonKey.SignificantOther,
    heading: 'Significant other',
    pricing: 'paid',
    dialogHeading: 'add your significant other',
    formValues: { 'First name': 'Jane', 'Last name': 'Doe' },
  },
  {
    key: AddonKey.WaterBackup,
    heading: 'WATER BACK-UP',
    pricing: 'paid',
    dialogHeading: 'Water Back-Up',
  },
  {
    key: AddonKey.LandlordPropertyDamage,
    heading: 'LANDLORD PROPERTY DAMAGE',
    pricing: 'paid',
    dialogHeading: 'LANDLORD PROPERTY DAMAGE',
  },
  {
    key: AddonKey.EquipmentBreakdown,
    heading: 'Appliance (a.k.a. Equipment) Breakdown',
    pricing: 'paid',
  },
]

export function addonEntry(key: AddonKey): Addon {
  const entry = ADDONS.find((a) => a.key === key)
  if (!entry) {
    throw new Error(`No add-on entry for "${key}"`)
  }
  return entry
}

export type FormCase = {
  title: string
  values: FormValues
}

function baselineValues(key: AddonKey): FormValues {
  const values = addonEntry(key).formValues
  if (!values) {
    throw new Error(`Add-on "${key}" has no baseline form values`)
  }
  return values
}

function withoutField(values: FormValues, label: string): FormValues {
  return Object.fromEntries(Object.entries(values).filter(([key]) => key !== label))
}

export const INTERESTED_PARTY_BASELINE = baselineValues(AddonKey.InterestedParty)
export const SPOUSE_BASELINE = baselineValues(AddonKey.Spouse)

export const INTERESTED_PARTY_INVALID: FormCase[] = [
  { title: 'Name is missing', values: withoutField(INTERESTED_PARTY_BASELINE, 'Name') },
  { title: 'Address is missing', values: withoutField(INTERESTED_PARTY_BASELINE, 'Address') },
  { title: 'Email is missing', values: withoutField(INTERESTED_PARTY_BASELINE, 'Email') },
  {
    title: 'Email has no domain suffix',
    values: { ...INTERESTED_PARTY_BASELINE, Email: 'landlord@example' },
  },
  {
    title: 'Email has a doubled @',
    values: { ...INTERESTED_PARTY_BASELINE, Email: 'landlord@@example.com' },
  },
  {
    title: 'Email has no @',
    values: { ...INTERESTED_PARTY_BASELINE, Email: 'landlord.example.com' },
  },
  {
    title: 'Email has spaces',
    values: { ...INTERESTED_PARTY_BASELINE, Email: 'landlord @example.com' },
  },
]

export const INTERESTED_PARTY_VALID: FormCase[] = [
  { title: 'all fields are filled', values: INTERESTED_PARTY_BASELINE },
  {
    title: 'Email is upper case',
    values: { ...INTERESTED_PARTY_BASELINE, Email: 'LANDLORD@EXAMPLE.COM' },
  },
]

export const SPOUSE_INVALID: FormCase[] = [
  { title: 'First name is missing', values: withoutField(SPOUSE_BASELINE, 'First name') },
  { title: 'Last name is missing', values: withoutField(SPOUSE_BASELINE, 'Last name') },
  {
    title: 'both names are blank',
    values: { ...SPOUSE_BASELINE, 'First name': ' ', 'Last name': ' ' },
  },
  {
    title: 'Email is not an address',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane' },
  },
  {
    title: 'Email has no domain suffix',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane@example' },
  },
  {
    title: 'Email has a doubled @',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane@@example.com' },
  },
  {
    title: 'Email has no @',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane.example.com' },
  },
  {
    title: 'Email has spaces',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane @example.com' },
  },
]

export const SPOUSE_VALID: FormCase[] = [
  { title: 'Email is left empty', values: SPOUSE_BASELINE },
  {
    title: 'Email is a valid address',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane@example.com' },
  },
]
