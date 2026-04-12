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
