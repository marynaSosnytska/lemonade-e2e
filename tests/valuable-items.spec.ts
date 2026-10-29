import { test } from '@fixtures/test'
import {
  DEFAULT_VALUABLE_VALUE,
  VALUABLE_ITEMS,
  VALUABLE_VALUE_STEP,
  ValuableItem,
  valuableItemEntry,
} from '@data/quote-options'

test.describe('Valuable items', { tag: '@valuables' }, () => {
  for (const { item } of VALUABLE_ITEMS) {
    test(
      `${item}: adding at the default value adds exactly the quoted amount and removing restores the price`,
      { tag: '@smoke' },
      async ({ quotePage }) => {
        const before = await quotePage.priceSummary.readCents()
        const card = quotePage.valuableItem(item)

        const quoted = await card.addAtDefaultValue()
        const expectedPrice = before + quoted

        await test.step('the item is added and the price grows by exactly the quoted amount', async () => {
          await card.verifyAdded(DEFAULT_VALUABLE_VALUE)
          await quotePage.priceSummary.verifyPrice(expectedPrice)
        })

        await card.remove()

        await test.step('the item is gone and the price returns to the original', async () => {
          await card.verifyNotAdded()
          await quotePage.priceSummary.verifyPrice(before)
        })
      }
    )
  }

  test('a higher declared value quotes more and the total grows by that quote', async ({
    quotePage,
  }) => {
    const itemToTest = ValuableItem.Jewelry
    const before = await quotePage.priceSummary.readCents()
    const card = quotePage.valuableItem(itemToTest)
    const higherValue = DEFAULT_VALUABLE_VALUE + VALUABLE_VALUE_STEP
    const dialog = await card.add()

    const quoteAtDefault = await dialog.quotedCents()
    await dialog.increaseValue()

    await test.step('a higher declared value is quoted at a higher price', async () => {
      await dialog.verifyQuoteHigherThan(quoteAtDefault)
    })

    const quoteAtHigher = await dialog.quotedCents()

    const hasNotice = valuableItemEntry(itemToTest).hasNotice
    await dialog.confirm(hasNotice)
    const expectedPrice = before + quoteAtHigher

    await test.step('the price grows by the higher quote', async () => {
      await card.verifyAdded(higherValue)
      await quotePage.priceSummary.verifyPrice(expectedPrice)
    })
  })

  test('cancelling the removal keeps the item and the price', async ({ quotePage }) => {
    const before = await quotePage.priceSummary.readCents()
    const card = quotePage.valuableItem(ValuableItem.Jewelry)
    const quoted = await card.addAtDefaultValue()
    const expectedPrice = before + quoted

    await card.startRemoval()
    await quotePage.confirmDialog.cancel()

    await test.step('the item stays added and the price keeps the extra coverage', async () => {
      await quotePage.confirmDialog.verifyClosed()
      await card.verifyAdded(DEFAULT_VALUABLE_VALUE)
      await quotePage.priceSummary.verifyPrice(expectedPrice)
    })
  })
})
