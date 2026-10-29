import type { QuotePage } from '@pages/QuotePage'
import { AddonKey } from '@data/addons'
import { Coverage } from '@data/coverage'
import { LOWEST_DEDUCTIBLE } from '@data/deductible'
import { dollarsText } from '@data/money'

export type QuoteChange = {
  title: string
  apply: (quotePage: QuotePage) => Promise<void>
}

export const QUOTE_CHANGES: QuoteChange[] = [
  {
    title: 'adding Equipment Breakdown',
    apply: async (quotePage) => {
      await quotePage.addon(AddonKey.EquipmentBreakdown).turnOn()
    },
  },
  {
    title: `choosing the ${dollarsText(LOWEST_DEDUCTIBLE)} deductible`,
    apply: (quotePage) => quotePage.deductible.choose(LOWEST_DEDUCTIBLE),
  },
  {
    title: 'raising Personal Liability',
    apply: (quotePage) => quotePage.coverage(Coverage.PersonalLiability).increase(),
  },
]
