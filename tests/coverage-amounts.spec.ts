import { test } from '@fixtures/test'
import { Billing } from '@data/money'
import { COVERAGES, Coverage } from '@data/quote-options'

test.describe('Coverage amounts', { tag: '@coverage' }, () => {
  test(
    'Personal Liability: stepping up raises the price and stepping back restores it',
    { tag: '@smoke' },
    async ({ quotePage }) => {
      const before = await quotePage.priceSummary.readCents()

      await quotePage.coverage(Coverage.PersonalLiability).increase()

      await test.step('a higher liability limit costs more', async () => {
        await quotePage.priceSummary.verifyHigherThan(before)
      })

      await quotePage.coverage(Coverage.PersonalLiability).decrease()

      await test.step('stepping back restores the original price', async () => {
        await quotePage.priceSummary.verifyPrice(before, Billing.Monthly)
      })
    }
  )

  test('Loss of use: stepping up raises the price and stepping back restores it', async ({
    quotePage,
  }) => {
    const before = await quotePage.priceSummary.readCents()

    await quotePage.coverage(Coverage.LossOfUse).increase()

    await test.step('a higher loss of use limit costs more', async () => {
      await quotePage.priceSummary.verifyHigherThan(before)
    })

    await quotePage.coverage(Coverage.LossOfUse).decrease()

    await test.step('stepping back restores the original price', async () => {
      await quotePage.priceSummary.verifyPrice(before, Billing.Monthly)
    })
  })

  test('Personal Property: stepping down lowers the price and stepping back up restores it', async ({
    quotePage,
  }) => {
    const before = await quotePage.priceSummary.readCents()

    await quotePage.coverage(Coverage.PersonalProperty).decrease()

    await test.step('a lower personal property limit costs less', async () => {
      await quotePage.priceSummary.verifyLowerThan(before)
    })

    await quotePage.coverage(Coverage.PersonalProperty).increase()

    await test.step('stepping back up restores the original price', async () => {
      await quotePage.priceSummary.verifyPrice(before, Billing.Monthly)
    })
  })

  test('each coverage starts at its limit with the button past it disabled', async ({
    quotePage,
  }) => {
    for (const { name, startsAt } of COVERAGES) {
      await test.step(`${name} starts at its ${startsAt} and cannot go further`, async () => {
        await quotePage.coverage(name).verifyAtStartingLimit(startsAt)
      })
    }
  })
})
