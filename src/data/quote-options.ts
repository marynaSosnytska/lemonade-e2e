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
