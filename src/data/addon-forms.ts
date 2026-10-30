import { AddonKey, addonEntry, type FormValues } from '@data/addons'

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
]

export const INTERESTED_PARTY_VALID: FormCase[] = [
  { title: 'all fields are filled', values: INTERESTED_PARTY_BASELINE },
  {
    title: 'Email is upper case',
    values: { ...INTERESTED_PARTY_BASELINE, Email: 'LANDLORD@EXAMPLE.COM' },
  },
  {
    title: 'Email has spaces',
    values: { ...INTERESTED_PARTY_BASELINE, Email: 'landlord @example.com' },
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
]

export const SPOUSE_VALID: FormCase[] = [
  { title: 'Email is left empty', values: SPOUSE_BASELINE },
  {
    title: 'Email is a valid address',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane@example.com' },
  },
  {
    title: 'Email has spaces',
    values: { ...SPOUSE_BASELINE, 'Email (optional)': 'jane @example.com' },
  },
]
