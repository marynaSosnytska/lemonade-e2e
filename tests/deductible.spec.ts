import { test } from '@fixtures/test'
import { Billing } from '@data/money'
import { DEDUCTIBLES, DEFAULT_DEDUCTIBLE } from '@data/deductible'

test.describe('Deductible', { tag: '@deductible' }, () => {
  test(
    'price strictly falls as the deductible rises and the default restores the original price',
    { tag: '@smoke' },
    async ({ quotePage }) => {
      const initialPrice = await quotePage.priceSummary.readCents()

      const higherDeductibles = DEDUCTIBLES.filter((d) => d > DEFAULT_DEDUCTIBLE)

      let before = initialPrice

      for (const deductible of higherDeductibles) {
        await test.step(`choosing a deductible of ${deductible} dollars lowers the price`, async () => {
          await quotePage.deductible.choose(deductible)
          await quotePage.deductible.verifySelected(deductible)
          await quotePage.priceSummary.verifyLowerThan(before)

          before = await quotePage.priceSummary.readCents()
        })
      }

      await test.step('choosing the default deductible restores the original price', async () => {
        await quotePage.deductible.choose(DEFAULT_DEDUCTIBLE)
        await quotePage.deductible.verifySelected(DEFAULT_DEDUCTIBLE)
        await quotePage.priceSummary.verifyPrice(initialPrice, Billing.Monthly)
      })
    }
  )

  test(
    'price strictly rises as the deductible falls and the default restores the original price',
    { tag: '@smoke' },
    async ({ quotePage }) => {
      const initialPrice = await quotePage.priceSummary.readCents()

      const lowerDeductibles = DEDUCTIBLES.filter((d) => d < DEFAULT_DEDUCTIBLE)

      let before = initialPrice

      for (const deductible of lowerDeductibles.reverse()) {
        await test.step(`choosing a deductible of ${deductible} dollars raises the price`, async () => {
          await quotePage.deductible.choose(deductible)
          await quotePage.deductible.verifySelected(deductible)
          await quotePage.priceSummary.verifyHigherThan(before)

          before = await quotePage.priceSummary.readCents()
        })
      }

      await test.step('choosing the default deductible restores the original price', async () => {
        await quotePage.deductible.choose(DEFAULT_DEDUCTIBLE)
        await quotePage.deductible.verifySelected(DEFAULT_DEDUCTIBLE)
        await quotePage.priceSummary.verifyPrice(initialPrice, Billing.Monthly)
      })
    }
  )
})
