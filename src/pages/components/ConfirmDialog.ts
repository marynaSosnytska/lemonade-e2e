import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'

export class ConfirmDialog {
  readonly dialog: Locator
  readonly yesButton: Locator
  readonly cancelButton: Locator

  constructor(page: Page) {
    this.dialog = page
      .getByRole('dialog')
      .filter({ has: page.getByRole('heading', { name: 'Are you sure?' }) })
    this.yesButton = this.dialog.getByRole('button', { name: 'Yes', exact: true })
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel', exact: true })
  }

  // Actions

  @step('Confirm with Yes')
  async yes() {
    await this.yesButton.click()
  }

  @step('Dismiss with Cancel')
  async cancel() {
    await this.cancelButton.click()
  }

  // Verifications

  @step('Verify the confirmation dialog is closed')
  async verifyClosed() {
    await expect(this.yesButton, 'the confirmation dialog is gone').toBeHidden()
  }
}
