import type { Locator, Page } from '@playwright/test'
import { step } from '@framework/step-decorator'

export class BillingToggle {
  readonly monthlyLabel: Locator
  readonly annualLabel: Locator

  constructor(page: Page) {
    const toggle = page.getByLabel('switch')
    this.monthlyLabel = toggle.getByLabel('MONTHLY', { exact: true }).locator('..')
    this.annualLabel = toggle.getByLabel('ANNUAL (-$12)', { exact: true }).locator('..')
  }

  // Actions

  @step('Choose annual billing')
  async chooseAnnual() {
    await this.annualLabel.click()
  }

  @step('Choose monthly billing')
  async chooseMonthly() {
    await this.monthlyLabel.click()
  }
}
