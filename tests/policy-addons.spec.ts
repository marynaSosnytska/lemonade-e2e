import { test } from '@fixtures/test'
import { ADDONS, AddonKey, PricingType } from '@data/addons'

test.describe('Policy add-ons', { tag: '@addons' }, () => {
  for (const addon of ADDONS.filter((a) => a.pricing === PricingType.Free)) {
    test(`${addon.heading}: completing its form turns it on without changing the price, and turning it off keeps the price`, async ({
      quotePage,
    }) => {
      const before = await quotePage.priceSummary.readCents()
      const row = quotePage.addon(addon.key)

      await row.turnOn()

      await test.step('the add-on is on and the price is unchanged', async () => {
        await row.verifyOn()
        await quotePage.priceSummary.verifyPrice(before)
      })

      await row.turnOff()

      await test.step('the add-on is off and the price is still unchanged', async () => {
        await row.verifyOff()
        await quotePage.priceSummary.verifyPrice(before)
      })
    })
  }

  for (const addon of ADDONS.filter((a) => a.pricing === PricingType.Paid)) {
    test(
      `${addon.heading}: turning it on adds exactly its quoted price and turning it off restores the original`,
      { tag: '@smoke' },
      async ({ quotePage }) => {
        const before = await quotePage.priceSummary.readCents()
        const row = quotePage.addon(addon.key)

        const quoted = await row.turnOn()
        const expectedPrice = before + quoted

        await test.step('the add-on is on and the price grows by exactly its quoted amount', async () => {
          await row.verifyOn()
          await quotePage.priceSummary.verifyPrice(expectedPrice)
        })

        await row.turnOff()

        await test.step('the add-on is off and the price returns to the original', async () => {
          await row.verifyOff()
          await quotePage.priceSummary.verifyPrice(before)
        })
      }
    )
  }

  test('closing an add-on form without submitting leaves it off and the price unchanged', async ({
    quotePage,
  }) => {
    const before = await quotePage.priceSummary.readCents()
    const row = quotePage.addon(AddonKey.SignificantOther)

    await row.toggle()
    await row.closeForm()

    await test.step('the add-on stays off and the price is unchanged', async () => {
      await row.verifyOff()
      await quotePage.priceSummary.verifyPrice(before)
    })
  })
})
