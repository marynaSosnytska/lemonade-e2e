import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import type { Coverage, CoverageStart } from '@data/quote-options'

export class CoverageRow {
  readonly row: Locator
  readonly increaseButton: Locator
  readonly decreaseButton: Locator

  constructor(page: Page, name: Coverage) {
    // The row has no role, label or id. Every div that holds both the exact heading and an
    // increase button matches (the row and all its ancestors), so the innermost one is the
    // last in document order. This choice is positional.
    this.row = page
      .locator('div')
      .filter({ has: page.getByRole('heading', { name, exact: true }) })
      .filter({ has: page.getByRole('button', { name: 'increase', exact: true }) })
      .last()
    this.increaseButton = this.row.getByRole('button', { name: 'increase', exact: true })
    this.decreaseButton = this.row.getByRole('button', { name: 'decrease', exact: true })
  }

  // Actions

  @step('Increase the coverage by one step')
  async increase() {
    await this.increaseButton.click()
  }

  @step('Decrease the coverage by one step')
  async decrease() {
    await this.decreaseButton.click()
  }

  // Verifications

  @step('Verify the coverage cannot be increased')
  async verifyIncreaseDisabled() {
    await expect(this.increaseButton, 'increase is disabled at the maximum').toBeDisabled()
  }

  @step('Verify the coverage cannot be decreased')
  async verifyDecreaseDisabled() {
    await expect(this.decreaseButton, 'decrease is disabled at the minimum').toBeDisabled()
  }

  @step('Verify the coverage cannot go past its starting limit')
  async verifyAtStartingLimit(startsAt: CoverageStart['startsAt']) {
    if (startsAt === 'max') {
      await this.verifyIncreaseDisabled()
    } else {
      await this.verifyDecreaseDisabled()
    }
  }
}
