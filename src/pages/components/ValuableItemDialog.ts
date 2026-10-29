import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { toCents } from '@data/money'

export class ValuableItemDialog {
  readonly dialog: Locator
  readonly increaseButton: Locator
  readonly decreaseButton: Locator
  readonly addButton: Locator
  readonly gotItButton: Locator
  readonly noticeHeading: Locator

  constructor(page: Page, heading: string) {
    this.dialog = page
      .getByRole('dialog')
      .filter({ has: page.getByRole('heading', { name: heading, exact: true }) })
    this.increaseButton = this.dialog.getByRole('button', { name: 'increase', exact: true })
    this.decreaseButton = this.dialog.getByRole('button', { name: 'decrease', exact: true })
    this.addButton = this.dialog.getByRole('button', { name: /^Add \(\+\$/ })
    this.gotItButton = this.dialog.getByRole('button', { name: /Got it$/ })
    this.noticeHeading = this.dialog.getByRole('heading', {
      name: 'This Is Important',
      exact: true,
    })
  }

  // Actions

  @step('Increase the declared value by one step')
  async increaseValue() {
    await this.increaseButton.click()
  }

  @step('Decrease the declared value by one step')
  async decreaseValue() {
    await this.decreaseButton.click()
  }

  @step('Read the quoted monthly amount from the Add button')
  async quotedCents(): Promise<number> {
    return toCents(await this.addButton.innerText())
  }

  // Verifications

  @step('Verify the quote is higher than ${0} cents')
  async verifyQuoteHigherThan(cents: number) {
    await expect
      .poll(() => this.quotedCents(), { message: `the quote is higher than ${cents} cents` })
      .toBeGreaterThan(cents)
  }

  @step('Verify the notice step is showing')
  async verifyNoticeShown() {
    await expect(this.noticeHeading, 'the notice step is showing').toBeInViewport()
  }

  // Combined flows

  @step('Confirm the item')
  async confirm() {
    await this.addButton.click()
    await this.verifyNoticeShown()
    await this.gotItButton.click()
  }
}
