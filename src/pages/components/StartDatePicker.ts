import type { Moment } from 'moment'
import { expect, type Locator } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { dayLabel, getMonthsBetween, monthYearText, usDateText } from '@data/dates'

const MAX_MONTH_CLICKS = 6

export class StartDatePicker {
  readonly header: Locator
  readonly monthHeader: Locator
  readonly backButton: Locator
  readonly forwardButton: Locator
  readonly day: (date: Moment) => Locator

  constructor(root: Locator) {
    this.header = root.getByTestId('select-header')
    this.monthHeader = root.getByText(/^[A-Z][a-z]+ \d{4}$/)
    this.backButton = root.getByRole('button', { name: 'Go back 1 month' })
    this.forwardButton = root.getByRole('button', { name: 'Go forward 1 month' })
    this.day = (date: Moment) => root.getByRole('button', { name: dayLabel(date), exact: true })
  }

  // Actions

  @step('Open the start date calendar')
  async open(): Promise<void> {
    await this.header.click()
  }

  @step('Pick a day in the open calendar')
  async pick(date: Moment): Promise<void> {
    await this.day(date).click()
  }

  // Days outside the window have pointer-events: none, so a normal click times out waiting for the
  // day to receive it. A forced click lands on whatever is underneath, like a real user's click.
  @step('Try to pick a day outside the window')
  async tryToPick(date: Moment): Promise<void> {
    await this.day(date).click({ force: true })
  }

  @step('Go to another month in the calendar')
  async goToMonth(date: Moment): Promise<void> {
    const shownText = await this.monthHeader.innerText()
    const monthsToMove = getMonthsBetween(shownText, date)
    if (Math.abs(monthsToMove) > MAX_MONTH_CLICKS) {
      throw new Error(`The window spans at most ${MAX_MONTH_CLICKS} months, got ${monthsToMove}`)
    }
    const button = monthsToMove > 0 ? this.forwardButton : this.backButton
    for (let i = 0; i < Math.abs(monthsToMove); i++) {
      await button.click()
    }
  }

  // Verifications

  @step('Verify the picker shows the expected date')
  async verifyShows(date: Moment): Promise<void> {
    await expect(this.header, `the picker shows ${usDateText(date)}`).toHaveText(usDateText(date))
  }

  @step('Verify the calendar shows the expected month')
  async verifyMonthShown(date: Moment): Promise<void> {
    await expect(this.monthHeader, `the calendar shows ${monthYearText(date)}`).toHaveText(
      monthYearText(date)
    )
  }

  @step('Verify the calendar cannot go back')
  async verifyCannotGoBack(): Promise<void> {
    await expect(
      this.backButton,
      'going back is disabled at the start of the window'
    ).toBeDisabled()
  }

  @step('Verify the calendar cannot go forward')
  async verifyCannotGoForward(): Promise<void> {
    await expect(
      this.forwardButton,
      'going forward is disabled at the end of the window'
    ).toBeDisabled()
  }

  @step('Verify the day is disabled')
  async verifyDayDisabled(date: Moment): Promise<void> {
    await expect(
      this.day(date),
      `${dayLabel(date)} carries the disabled attribute`
    ).toHaveAttribute('disabled', '')
  }

  @step('Verify the day is not selected')
  async verifyDayNotSelected(date: Moment): Promise<void> {
    await expect(this.day(date), `${dayLabel(date)} is not selected`).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  }

  // Combined flows

  @step('Open the calendar and pick a day')
  async openAndPick(date: Moment): Promise<void> {
    await this.open()
    await this.goToMonth(date)
    await this.pick(date)
  }
}
