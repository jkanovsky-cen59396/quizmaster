import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { expectTextToBe } from '#steps/common.ts'
import { Then, When } from '#steps/fixture.ts'

Then('I see a number input', async function () {
    await expect(this.takeQuestionPage.numericalInputLocator()).toBeVisible()
})

When('I enter {string}', async function (answer: string) {
    await this.takeQuestionPage.fillNumericalAnswer(answer)
})

When('I retake with answers:', async function (data: DataTable) {
    for (const { answer, feedback } of data.hashes()) {
        await this.takeQuestionPage.fillNumericalInput(answer)
        await this.takeQuestionPage.expectNoQuestionFeedback()
        await this.takeQuestionPage.submit()
        await expectTextToBe(this.takeQuestionPage.questionFeedbackLocator(), feedback)
    }
})

// This step is used to verify that the submit button's state (enabled/disabled)
// changes correctly based on the input provided.
// The data table should have two columns: "answer" and "state", where "state" can be either "active"
// (submit button enabled) or "inactive" (submit button disabled).
When('I retake with submit button states:', async function (data: DataTable) {
    for (const { answer, state } of data.hashes()) {
        await this.takeQuestionPage.fillNumericalInput(answer)

        if (state === 'active') {
            await this.takeQuestionPage.expectSubmitEnabled()
            continue
        }

        if (state === 'inactive') {
            await this.takeQuestionPage.expectSubmitDisabled()
            continue
        }

        throw new Error(`Invalid submit button state: ${state}. Allowed values are "active" or "inactive".`)
    }
})
