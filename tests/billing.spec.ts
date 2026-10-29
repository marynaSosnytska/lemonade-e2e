import { test } from '@fixtures/test'
import { Billing, annualFromMonthly } from '@data/money'

test.describe('Billing period', { tag: '@billing' }, () => {
  test(
    'annual billing costs 12 x monthly minus $12 and switching back restores the monthly price',
    { tag: '@smoke' },
    async ({ quotePage }) => {
      const monthly = await quotePage.priceSummary.readCents()

      await quotePage.billing.chooseAnnual()

      await test.step('the annual price is 12 monthly payments minus $12', async () => {
        const annual = annualFromMonthly(monthly)
        await quotePage.priceSummary.verifyPrice(annual, Billing.Annual)
      })

      await quotePage.billing.chooseMonthly()

      await test.step('switching back restores the monthly price', async () => {
        await quotePage.priceSummary.verifyPrice(monthly, Billing.Monthly)
      })

      await quotePage.scrollToActivate()

      await test.step('the price stays readable after scrolling to the Activate section', async () => {
        await quotePage.priceSummary.verifyPrice(monthly, Billing.Monthly)
      })
    }
  )
})
