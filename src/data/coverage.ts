export enum Coverage {
  PersonalProperty = 'Personal Property',
  PersonalLiability = 'Personal Liability',
  LossOfUse = 'Loss of use',
  MedicalPayments = 'Medical payments to others',
}

export const enum CoverageStarts {
  Max = 'max',
  Min = 'min',
}

export type CoverageStart = {
  name: Coverage
  startsAt: CoverageStarts
}

export const COVERAGES: CoverageStart[] = [
  { name: Coverage.PersonalProperty, startsAt: CoverageStarts.Max },
  { name: Coverage.PersonalLiability, startsAt: CoverageStarts.Min },
  { name: Coverage.LossOfUse, startsAt: CoverageStarts.Min },
  { name: Coverage.MedicalPayments, startsAt: CoverageStarts.Min },
]
