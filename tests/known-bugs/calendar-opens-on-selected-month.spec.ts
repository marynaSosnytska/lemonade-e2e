import { test } from '@fixtures/test'
import { QUOTE_START_DATE } from '@data/dates'

test.describe('Known bugs', { tag: ['@known-bug', '@start-date'] }, () => {
  test(
    'the calendar opens on the month of the selected date',
    {
      annotation: {
        type: 'issue',
        description:
          'On first open the start date calendar shows June 2026 instead of March, the month of the selected 03/13/2026',
      },
    },
    async ({ quotePage }) => {
      test.fail()

      await quotePage.heroStartDate.open()

      await test.step('the calendar shows the month of the selected start date', async () => {
        await quotePage.heroStartDate.verifyMonthShown(QUOTE_START_DATE)
      })
    }
  )
})
