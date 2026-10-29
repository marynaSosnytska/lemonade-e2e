import { test } from '@fixtures/test'
import { AddonKey } from '@data/addons'
import { INTERESTED_PARTY_BASELINE } from '@data/addon-forms'

test.describe('Known bugs', { tag: ['@known-bug', '@forms'] }, () => {
  test(
    'interested party rejects a whitespace-only name, as Spouse does',
    {
      annotation: {
        type: 'issue',
        description:
          'Interested party accepts a whitespace-only Name and saves a nameless entry; Spouse rejects the same input',
      },
    },
    async ({ quotePage }) => {
      test.fail()

      const row = quotePage.addon(AddonKey.InterestedParty)
      const expectedFailureTimeout = 2_000
      const blankNameValues = { ...INTERESTED_PARTY_BASELINE, Name: '   ' }

      await row.toggle()
      await row.fillForm(blankNameValues)

      await test.step('a whitespace-only name cannot be submitted', async () => {
        await row.verifyCannotSubmit(expectedFailureTimeout)
      })
    }
  )
})
