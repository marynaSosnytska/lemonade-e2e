import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { Billing, payText, toCents } from '@data/money'

export class PriceSummary {
  readonly payButton: Locator

  constructor(page: Page) {
    this.payButton = page
      .getByTestId('baseQuoteTopWrapper')
      .getByRole('button', { name: /^Pay \$/ })
  }

  // Actions

  @step('Read the price from the Pay button')
  async readCents(): Promise<number> {
    return toCents(await this.payButton.innerText())
  }

  // Verifications

  @step('Verify the price is ${0} cents')
  async verifyPrice(cents: number, billing: Billing = Billing.Monthly) {
    const expectedText = payText(cents, billing)
    await expect(this.payButton, `the Pay button shows ${expectedText}`).toHaveText(expectedText)
  }

  @step('Verify the price is higher than ${0} cents')
  async verifyHigherThan(cents: number) {
    await expect
      .poll(() => this.readCents(), { message: `the price is higher than ${cents} cents` })
      .toBeGreaterThan(cents)
  }

  @step('Verify the price is lower than ${0} cents')
  async verifyLowerThan(cents: number) {
    await expect
      .poll(() => this.readCents(), { message: `the price is lower than ${cents} cents` })
      .toBeLessThan(cents)
  }

  @step('Verify the price is shown')
  async verifyShown() {
    await expect(this.payButton, 'the Pay button is visible').toBeVisible()
  }
}
