import { test } from '@fixtures/test'
import { Billing, annualFromMonthlyTotal, yearlyFromMonthlyForAddon } from '@data/money'
import { AddonKey } from '@data/addons'
import { QUOTE_CHANGES } from '@data/quote-changes'

test.describe('Billing period', { tag: '@billing' }, () => {
  test(
    'annual billing costs 12 x monthly minus $12 and switching back restores the monthly price',
    { tag: '@smoke' },
    async ({ quotePage }) => {
      const monthly = await quotePage.priceSummary.getPriceInCents()

      await quotePage.billing.chooseAnnual()

      await test.step('the annual price is 12 monthly payments minus $12', async () => {
        const annual = annualFromMonthlyTotal(monthly)
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

  for (const { title, apply } of QUOTE_CHANGES) {
    test(`the annual price stays 12 x monthly minus $12 after ${title}`, async ({ quotePage }) => {
      const before = await quotePage.priceSummary.getPriceInCents()

      await apply(quotePage)

      await test.step('the change raises the monthly price', async () => {
        await quotePage.priceSummary.verifyHigherThan(before)
      })

      const monthly = await quotePage.priceSummary.getPriceInCents()

      await quotePage.billing.chooseAnnual()

      await test.step('the annual price is still 12 monthly payments minus $12', async () => {
        const annual = annualFromMonthlyTotal(monthly)
        await quotePage.priceSummary.verifyPrice(annual, Billing.Annual)
      })
    })
  }

  test('in annual mode a paid add-on lists 12 x its monthly price and adds exactly that', async ({
    quotePage,
  }) => {
    const row = quotePage.addon(AddonKey.EquipmentBreakdown)
    const monthlyBefore = await quotePage.priceSummary.getPriceInCents()
    const monthlyListed = await row.getListedCents()
    const expectedYearly = yearlyFromMonthlyForAddon(monthlyListed)

    await test.step('in monthly mode the add-on row lists its monthly price', async () => {
      await row.verifyListed(monthlyListed, Billing.Monthly)
    })

    await quotePage.billing.chooseAnnual()

    const annualBefore = annualFromMonthlyTotal(monthlyBefore)

    await test.step('the annual price before the add-on is 12 monthly payments minus $12', async () => {
      await quotePage.priceSummary.verifyPrice(annualBefore, Billing.Annual)
    })

    await test.step('in annual mode the add-on row lists 12 x its monthly price', async () => {
      await row.verifyListed(expectedYearly, Billing.Annual)
    })

    await row.turnOnAndGetQuotation()

    await test.step('the annual price grows by exactly the listed yearly amount', async () => {
      const annualAfter = annualBefore + expectedYearly
      await row.verifyOn()
      await quotePage.priceSummary.verifyPrice(annualAfter, Billing.Annual)
    })
  })
})
