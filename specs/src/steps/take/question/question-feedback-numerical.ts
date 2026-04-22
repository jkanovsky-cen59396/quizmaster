import type { DataTable } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

import { expectTextToBe } from '#steps/common.ts'
import { Then, When } from '#steps/fixture.ts'
import type { QuestionSpec } from '#steps/shared/specs.ts'

const countDecimalDigits = (value: string): number => {
    const [, decimals] = value.split('.')
    return decimals?.length ?? 0
}

const resolveCurrentQuestion = async (world: {
    takeQuestionPage: { questionText: () => Promise<string | null> }
    questionBookmarks: Record<string, QuestionSpec>
}): Promise<QuestionSpec> => {
    const questionText = (await world.takeQuestionPage.questionText())?.trim()
    if (!questionText) {
        throw new Error('Cannot verify decimal hint: current question text is missing.')
    }

    const spec = Object.values(world.questionBookmarks).find(question => question.text === questionText)
    if (!spec) {
        throw new Error(`Cannot verify decimal hint: question "${questionText}" was not found in bookmarks.`)
    }

    return spec
}

Then('I see a number input', async function () {
    await expect(this.takeQuestionPage.numericalInputLocator()).toBeVisible()
})

Then(/^I see hint to enter answer with (\d+) decimal digits$/, async function (digitsRaw: string) {
    const expectedDigitsFromStep = Number.parseInt(digitsRaw, 10)
    const question = await resolveCurrentQuestion(this)

    if (!question.numericalAnswer) {
        throw new Error('Cannot verify decimal hint: current question is not numerical.')
    }

    const expectedDigitsFromAnswer = countDecimalDigits(question.numericalAnswer)
    if (expectedDigitsFromStep !== expectedDigitsFromAnswer) {
        throw new Error(
            `Invalid step data: expected ${expectedDigitsFromAnswer} decimal digits from correct answer, got ${expectedDigitsFromStep}.`,
        )
    }

    await this.takeQuestionPage.expectNumericalAnswerDigitsHint(expectedDigitsFromAnswer)
})

Then('I do not see a decimal digits hint', async function () {
    await this.takeQuestionPage.expectNoNumericalAnswerDigitsHint()
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
