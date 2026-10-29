import { test } from '@fixtures/test'
import { Billing } from '@data/money'
import {
  DAY_AFTER_WINDOW,
  DAY_BEFORE_WINDOW,
  LAST_START_DATE,
  PICKED_START_DATE,
  QUOTE_START_DATE,
} from '@data/dates'

test.describe('Start date', { tag: '@start-date' }, () => {
  test('the quote opens on its start date and both pickers agree', async ({ quotePage }) => {
    await test.step('the hero picker shows the quote start date', async () => {
      await quotePage.heroStartDate.verifyShows(QUOTE_START_DATE)
    })

    await test.step('the Activate picker shows the same date', async () => {
      await quotePage.activateStartDate.verifyShows(QUOTE_START_DATE)
    })
  })

  test(
    'picking a date in the window updates both pickers and leaves the price unchanged',
    { tag: '@smoke' },
    async ({ quotePage }) => {
      const priceBefore = await quotePage.priceSummary.getPriceInCents()

      await quotePage.heroStartDate.openAndPick(PICKED_START_DATE)

      await test.step('both pickers show the picked date', async () => {
        await quotePage.heroStartDate.verifyShows(PICKED_START_DATE)
        await quotePage.activateStartDate.verifyShows(PICKED_START_DATE)
      })

      await test.step('the price is unchanged', async () => {
        await quotePage.priceSummary.verifyPrice(priceBefore, Billing.Monthly)
      })
    }
  )

  test('the selectable window runs from the quote start to June 30', async ({ quotePage }) => {
    await quotePage.heroStartDate.openAndPick(LAST_START_DATE)

    await test.step('the last day of the window can be picked', async () => {
      await quotePage.heroStartDate.verifyShows(LAST_START_DATE)
      await quotePage.activateStartDate.verifyShows(LAST_START_DATE)
    })

    await quotePage.heroStartDate.open()
    await quotePage.heroStartDate.goToMonth(QUOTE_START_DATE)

    await test.step('the calendar cannot go back before the quote start month', async () => {
      await quotePage.heroStartDate.verifyCannotGoBack()
    })

    await quotePage.heroStartDate.tryToPick(DAY_BEFORE_WINDOW)

    await test.step('the day before the quote start is disabled and the calendar stays on March', async () => {
      await quotePage.heroStartDate.verifyDayDisabled(DAY_BEFORE_WINDOW)
      await quotePage.heroStartDate.verifyDayNotSelected(DAY_BEFORE_WINDOW)
      await quotePage.heroStartDate.verifyMonthShown(QUOTE_START_DATE)
    })

    await test.step('the day before the quote start cannot be picked', async () => {
      await quotePage.heroStartDate.verifyShows(LAST_START_DATE)
      await quotePage.activateStartDate.verifyShows(LAST_START_DATE)
    })

    await quotePage.heroStartDate.pick(QUOTE_START_DATE)

    await test.step('the quote start day can be picked', async () => {
      await quotePage.heroStartDate.verifyShows(QUOTE_START_DATE)
      await quotePage.activateStartDate.verifyShows(QUOTE_START_DATE)
    })

    await quotePage.heroStartDate.open()
    await quotePage.heroStartDate.goToMonth(LAST_START_DATE)

    await test.step('the calendar cannot go forward past June', async () => {
      await quotePage.heroStartDate.verifyCannotGoForward()
    })

    await quotePage.heroStartDate.tryToPick(DAY_AFTER_WINDOW)

    await test.step('the day after June 30 is disabled and the calendar stays on June', async () => {
      await quotePage.heroStartDate.verifyDayDisabled(DAY_AFTER_WINDOW)
      await quotePage.heroStartDate.verifyDayNotSelected(DAY_AFTER_WINDOW)
      await quotePage.heroStartDate.verifyMonthShown(LAST_START_DATE)
    })

    await test.step('the day after June 30 cannot be picked', async () => {
      await quotePage.heroStartDate.verifyShows(QUOTE_START_DATE)
      await quotePage.activateStartDate.verifyShows(QUOTE_START_DATE)
    })
  })
})
