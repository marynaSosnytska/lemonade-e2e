import { expect, type Locator, type Page } from '@playwright/test'
import { step } from '@framework/step-decorator'
import { toCents } from '@data/money'
import type { FormValues } from '@data/quote-options'

export class AddonDialog {
  readonly dialog: Locator
  readonly submitButton: Locator
  readonly closeButton: Locator
  readonly field: (label: string) => Locator

  constructor(page: Page, heading: string) {
    this.dialog = page
      .getByRole('dialog')
      .filter({ has: page.getByRole('heading', { name: heading, exact: true }) })
    this.submitButton = this.dialog.getByRole('button', { name: /^Add/ })
    this.closeButton = this.dialog.getByRole('button', { name: 'close dialog', exact: true })
    this.field = (label: string) => this.dialog.getByRole('textbox', { name: label, exact: true })
  }

  // Actions

  @step('Fill the form fields ${0}')
  async fillForm(values: FormValues) {
    for (const [label, value] of Object.entries(values)) {
      await this.field(label).fill(value)
    }
  }

  @step('Submit the form')
  async submit() {
    await this.submitButton.click()
  }

  @step('Close the form without submitting')
  async close() {
    await this.closeButton.click()
  }

  @step('Read the quoted monthly amount from the submit button')
  async quotedCents(): Promise<number> {
    const text = await this.submitButton.innerText()
    return text.includes('$') ? toCents(text) : 0
  }

  // Verifications

  @step('Verify the form can be submitted')
  async verifyCanSubmit() {
    await expect(this.submitButton, 'the submit button is enabled').toBeEnabled()
  }

  @step('Verify the form cannot be submitted')
  async verifyCannotSubmit() {
    await expect(this.submitButton, 'the submit button is disabled').toBeDisabled()
  }

  @step('Verify the form is closed')
  async verifyClosed() {
    await expect(this.submitButton, 'the form is gone').toBeHidden()
  }
}
