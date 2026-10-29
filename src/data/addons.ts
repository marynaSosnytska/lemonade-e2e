export enum AddonKey {
  InterestedParty = 'interested_party',
  Spouse = 'secondary_insured',
  SignificantOther = 'other_members_of_household',
  WaterBackup = 'water_backup',
  LandlordPropertyDamage = 'landlord_property_damage',
  EquipmentBreakdown = 'equipment_breakdown',
}

export type FormValues = Record<string, string>

export enum PricingType {
  Free = 'free',
  Paid = 'paid',
}

export type Addon = {
  key: AddonKey
  heading: string
  pricing: PricingType
  dialogHeading?: string
  formValues?: FormValues
}

export const ADDONS: Addon[] = [
  {
    key: AddonKey.InterestedParty,
    heading: 'Interested party/Landlord',
    pricing: PricingType.Free,
    dialogHeading: 'add an interested party',
    formValues: { Name: 'Acme Properties', Address: '1 Main St', Email: 'landlord@example.com' },
  },
  {
    key: AddonKey.Spouse,
    heading: 'Spouse',
    pricing: PricingType.Free,
    dialogHeading: 'Add your spouse',
    formValues: { 'First name': 'Jane', 'Last name': 'Doe' },
  },
  {
    key: AddonKey.SignificantOther,
    heading: 'Significant other',
    pricing: PricingType.Paid,
    dialogHeading: 'add your significant other',
    formValues: { 'First name': 'Jane', 'Last name': 'Doe' },
  },
  {
    key: AddonKey.WaterBackup,
    heading: 'WATER BACK-UP',
    pricing: PricingType.Paid,
    dialogHeading: 'Water Back-Up',
  },
  {
    key: AddonKey.LandlordPropertyDamage,
    heading: 'LANDLORD PROPERTY DAMAGE',
    pricing: PricingType.Paid,
    dialogHeading: 'LANDLORD PROPERTY DAMAGE',
  },
  {
    key: AddonKey.EquipmentBreakdown,
    heading: 'Appliance (a.k.a. Equipment) Breakdown',
    pricing: PricingType.Paid,
  },
]

export function addonEntry(key: AddonKey): Addon {
  const entry = ADDONS.find((a) => a.key === key)
  if (!entry) {
    throw new Error(`No add-on entry for "${key}"`)
  }
  return entry
}
