import { test } from '@playwright/test'

/**
 * Decorator that wraps a class method with a Playwright test step.
 * Used for reporting purposes.
 *
 * @example
 * ```
 *    import { step } from '@framework/step-decorator';
 *    class MyTestClass {
 *        @step('optional step name')
 *        async myTestFunction() {
 *            // Test code goes here
 *        }
 *
 *        @step('Verify group occupancy is ${0} quantity and ${1} capacity')
 *        async expectGroupOccupancyIs(quantity: number, capacity: number) {
 *            // Test code goes here
 *        }
 *
 *        @step('User ${0.firstName} ${0.lastName} logs in')
 *        async loginUser(user: { firstName: string, lastName: string }) {
 *            // Test code goes here
 *        }
 *    }
 * ```
 */

// Regex to match parameter placeholders like ${0}, ${1}, ${0.property}
const PARAMETER_PLACEHOLDER_REGEX = /\$\{(\d+)(?:\.([^}]+))?\}/g

/**
 * Formats a value for display in step names
 */
function formatValue(value: any): string {
  if (Array.isArray(value)) return value.join(', ')
  if (value !== null && typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/**
 * Gets a nested property value from an object using dot notation
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

/**
 * Processes a message template and replaces parameter placeholders with actual values
 */
function processMessageTemplate(template: string, args: any[]): string {
  if (!template.includes('${')) return template

  return template.replace(PARAMETER_PLACEHOLDER_REGEX, (match, indexStr, propertyPath) => {
    const index = parseInt(indexStr, 10)
    if (index >= args.length) return match
    let value = args[index]
    if (propertyPath) value = getNestedProperty(value, propertyPath)
    return formatValue(value)
  })
}

export function step<This, Args extends any[], Return>(message?: string) {
  return function actualDecorator(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>
  ) {
    async function replacementMethod(this: any, ...args: Args) {
      let stepMessage: string

      if (message) {
        const processedMessage = processMessageTemplate(message, args)
        stepMessage = `[${this.constructor.name}] ${processedMessage}`
      } else {
        const methodName =
          (context.name as string).charAt(0).toUpperCase() + (context.name as string).slice(1)
        stepMessage = `[${this.constructor.name}] ${methodName}`
      }

      try {
        return await test.step(stepMessage, async () => target.call(this, ...args), { box: true })
      } catch (error) {
        if (
          error instanceof Error &&
          error.message.includes('test.step() can only be called from a test')
        ) {
          return target.call(this, ...args)
        }
        throw error
      }
    }

    return replacementMethod
  }
}
