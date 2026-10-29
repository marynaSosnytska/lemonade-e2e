import { test } from '@fixtures/test'
import { AddonKey } from '@data/addons'
import {
  INTERESTED_PARTY_BASELINE,
  INTERESTED_PARTY_INVALID,
  INTERESTED_PARTY_VALID,
  SPOUSE_BASELINE,
  SPOUSE_INVALID,
  SPOUSE_VALID,
} from '@data/addon-forms'

test.describe('Add-on forms', { tag: '@forms' }, () => {
  for (const { title, values } of INTERESTED_PARTY_INVALID) {
    test(`interested party cannot be added: ${title}`, async ({ quotePage }) => {
      const row = quotePage.addon(AddonKey.InterestedParty)

      await row.toggle()
      await row.fillForm(values)

      await test.step('the form cannot be submitted', async () => {
        await row.verifyCannotSubmit()
      })
    })
  }

  for (const { title, values } of INTERESTED_PARTY_VALID) {
    test(`interested party can be added: ${title}`, async ({ quotePage }) => {
      const row = quotePage.addon(AddonKey.InterestedParty)

      await row.toggle()
      await row.fillForm(values)

      await test.step('the form can be submitted', async () => {
        await row.verifyCanSubmit()
      })
    })
  }

  for (const { title, values } of SPOUSE_INVALID) {
    test(`spouse cannot be added: ${title}`, async ({ quotePage }) => {
      const row = quotePage.addon(AddonKey.Spouse)

      await row.toggle()
      await row.fillForm(values)

      await test.step('the form cannot be submitted', async () => {
        await row.verifyCannotSubmit()
      })
    })
  }

  for (const { title, values } of SPOUSE_VALID) {
    test(`spouse can be added: ${title}`, async ({ quotePage }) => {
      const row = quotePage.addon(AddonKey.Spouse)

      await row.toggle()
      await row.fillForm(values)

      await test.step('the form can be submitted', async () => {
        await row.verifyCanSubmit()
      })
    })
  }

  test(
    'saving a valid form turns the add-on on and shows the saved details',
    { tag: '@smoke' },
    async ({ quotePage }) => {
      const spouse = quotePage.addon(AddonKey.Spouse)
      const interestedParty = quotePage.addon(AddonKey.InterestedParty)
      const spouseName = `${SPOUSE_BASELINE['First name']} ${SPOUSE_BASELINE['Last name']}`
      const interestedPartyName = INTERESTED_PARTY_BASELINE.Name

      await spouse.turnOnAndGetQuotation()
      await interestedParty.turnOnAndGetQuotation()

      await test.step('the spouse is on and shows the saved name', async () => {
        await spouse.verifyOn()
        await spouse.verifySavedDetails(spouseName)
      })

      await test.step('the interested party is on and shows the saved name', async () => {
        await interestedParty.verifyOn()
        await interestedParty.verifySavedDetails(interestedPartyName)
      })
    }
  )
})
