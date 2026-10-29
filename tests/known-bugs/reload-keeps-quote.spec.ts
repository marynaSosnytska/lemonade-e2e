import { test } from '@fixtures/test'

test.describe('Known bugs', { tag: ['@known-bug', '@billing'] }, () => {
  test(
    'reloading the page keeps the quote',
    {
      annotation: {
        type: 'issue',
        description:
          'The app rewrites the URL to /quotes/<id> without the /qa-interview-task base path, so a reload returns the GitHub Pages 404',
      },
    },
    async ({ page, quotePage }) => {
      test.fail()

      // The only allowed reload: reloading is the behavior under test.
      await page.reload()

      await test.step('the quote is still shown after the reload', async () => {
        await quotePage.priceSummary.verifyShown()
      })
    }
  )
})
