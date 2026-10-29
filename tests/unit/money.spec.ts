import { test, expect } from '@fixtures/test'
import {
  Billing,
  annualFromMonthlyTotal,
  dollarsText,
  payText,
  priceText,
  toCents,
  yearlyFromMonthlyForAddon,
} from '@data/money'

test.describe('Money helpers', { tag: '@unit' }, () => {
  for (const [input, cents] of [
    ['$14.33', 1_433],
    ['Pay $14.33.', 1_433],
    ['Pay $159.96 / year', 15_996],
    ['$50,000', 5_000_000],
    ['+$1.67/MO', 167],
    ['Add (+$0.92)/MOGot it', 92],
    ['+$36.00/YR', 3_600],
    ['Starts from +$0.83/MO', 83],
    ['$1,000', 100_000],
    ['up to $25,000.', 2_500_000],
  ] as const) {
    test(`toCents reads "${input}"`, async () => {
      await test.step('the first dollar amount in the text is returned as integer cents', () => {
        expect(toCents(input), `"${input}" is ${cents} cents`).toBe(cents)
      })
    })
  }

  for (const input of [
    'Free',
    '$5.5',
    '$14.333',
    '$1,00',
    '$1,2345.67',
    '$',
    '$.50',
    '',
  ] as const) {
    test(`toCents rejects "${input}"`, async () => {
      await test.step('text without a well-formed dollar amount is rejected instead of guessed', () => {
        expect(() => toCents(input), `"${input}" is not a readable price`).toThrow()
      })
    })
  }

  test('price formatting helpers render cents as page text', async () => {
    await test.step('cents render as a dollar price with two decimals', () => {
      expect(priceText(1_747), '1_747 cents is $17.47').toBe('$17.47')
    })

    await test.step('the Pay button text carries the price and billing period', () => {
      expect(payText(15_996, Billing.Annual), 'annual Pay button text').toBe('Pay $159.96 / year')
    })

    await test.step('whole dollars render with thousands grouping', () => {
      expect(dollarsText(2_500), '2_500 dollars is $2,500').toBe('$2,500')
    })
  })

  test('yearlyFromMonthly multiplies a monthly amount by twelve', async () => {
    await test.step('the yearly amount is the monthly amount times 12', () => {
      const monthlyCents = 300
      const yearlyCents = 3_600
      expect(yearlyFromMonthlyForAddon(monthlyCents), 'yearly amount for $3.00 / month').toBe(yearlyCents)
    })
  })

  test('annualFromMonthly applies twelve months minus the annual discount', async () => {
    await test.step('the annual price is the monthly price times 12 minus $12', () => {
      const monthlyCents = 1_433
      const annualCents = 15_996
      expect(annualFromMonthlyTotal(monthlyCents), 'annual price for $14.33 / month').toBe(annualCents)
    })
  })
})
