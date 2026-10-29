import { test } from '@fixtures/test'
import { Coverage } from '@data/quote-options'

test.describe('Known bugs', { tag: ['@known-bug', '@coverage'] }, () => {
  test(
    'increasing Medical payments changes the price',
    {
      annotation: {
        type: 'issue',
        description:
          'Medical payments to others $1,000 -> $2,000 leaves the price unchanged; by design or a pricing bug?',
      },
    },
    async ({ quotePage }) => {
      test.fail()

      const before = await quotePage.priceSummary.readCents()

      await quotePage.coverage(Coverage.MedicalPayments).increase()

      await test.step('a higher medical payments limit costs more', async () => {
        await quotePage.priceSummary.verifyHigherThan(before)
      })
    }
  )
})
