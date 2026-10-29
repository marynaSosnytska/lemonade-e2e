import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { Billing, payText, toCents } from '@data/money'

export class PriceSummary {
  // The page has a hero Pay button, a sticky header copy and one in the Activate section, and only
  // the hero one sits in baseQuoteTopWrapper, so this scope stays unique before and after scrolling.
  readonly payButton: Locator

  constructor(page: Page) {
    this.payButton = page
      .getByTestId('baseQuoteTopWrapper')
      .getByRole('button', { name: /^Pay \$/ })
  }

  // Actions

  @step('Read the price from the Pay button')
  async getPriceInCents(): Promise<number> {
    return toCents(await this.payButton.innerText())
  }

  // Verifications

  @step('Verify the price is ${0} cents')
  async verifyPrice(cents: number, billing: Billing = Billing.Monthly): Promise<void> {
    const expectedText = payText(cents, billing)
    await expect(this.payButton, `the Pay button shows ${expectedText}`).toHaveText(expectedText)
  }

  @step('Verify the price is higher than ${0} cents')
  async verifyHigherThan(cents: number): Promise<void> {
    await expect
      .poll(() => this.getPriceInCents(), { message: `the price is higher than ${cents} cents` })
      .toBeGreaterThan(cents)
  }

  @step('Verify the price is lower than ${0} cents')
  async verifyLowerThan(cents: number): Promise<void> {
    await expect
      .poll(() => this.getPriceInCents(), { message: `the price is lower than ${cents} cents` })
      .toBeLessThan(cents)
  }

  @step('Verify the price is shown')
  async verifyShown(): Promise<void> {
    await expect(this.payButton, 'the Pay button is visible').toBeVisible()
  }
}
