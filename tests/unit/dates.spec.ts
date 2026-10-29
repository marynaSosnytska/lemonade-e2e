import moment from 'moment'
import { test, expect } from '@fixtures/test'
import { dayLabel, getMonthsBetween, monthYearText, usDateText } from '@data/dates'

test.describe('Date helpers', { tag: '@unit' }, () => {
  for (const [shown, target, months] of [
    ['June 2026', moment({ year: 2026, month: 2, day: 13 }), -3],
    ['March 2026', moment({ year: 2026, month: 5, day: 30 }), 3],
    ['June 2026', moment({ year: 2026, month: 5, day: 15 }), 0],
    ['December 2025', moment({ year: 2026, month: 0, day: 1 }), 1],
  ] as const) {
    test(`getMonthsBetween moves from "${shown}" to ${monthYearText(target)} by ${months}`, async () => {
      await test.step('the result is the signed number of months from the shown month to the target', () => {
        expect(getMonthsBetween(shown, target), `"${shown}" to the target month`).toBe(months)
      })
    })
  }

  for (const shown of ['Juno 2026', 'June', '2026', ''] as const) {
    test(`getMonthsBetween rejects the header "${shown}"`, async () => {
      await test.step('an unrecognised header throws instead of guessing', () => {
        expect(
          () => getMonthsBetween(shown, moment({ year: 2026, month: 2, day: 13 })),
          `"${shown}" is not a month header`
        ).toThrow('Unrecognised month header')
      })
    })
  }

  test('getMonthsBetween leaves the date it is given unchanged', async () => {
    const target = moment({ year: 2026, month: 5, day: 30 })

    getMonthsBetween('March 2026', target)

    await test.step('the target is still the same day', () => {
      expect(usDateText(target), 'the target date after the call').toBe('06/30/2026')
    })
  })

  test('formats a date as the calendar and the picker show it', async () => {
    const date = moment({ year: 2026, month: 6, day: 1 })

    await test.step('the picker text, month header and day label read as the page shows them', () => {
      expect(usDateText(date), 'picker text').toBe('07/01/2026')
      expect(monthYearText(date), 'month header').toBe('July 2026')
      expect(dayLabel(date), 'day label').toBe('Wed Jul 01 2026')
    })
  })
})
