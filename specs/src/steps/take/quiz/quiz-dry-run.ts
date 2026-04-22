import { Then, When } from '#steps/fixture.ts'
import { ensureFakeClockInstalled } from '#steps/quiz/ops.ts'

When('I start a dry run of quiz {string}', async function (quizName: string) {
    await this.workspacePage.dryRunQuiz(quizName)
})

When('I start the dry run', async function () {
    await ensureFakeClockInstalled(this)
    await this.quizWelcomePage.start()
})

Then('I see a dry-run indicator', async function () {
    await this.quizWelcomePage.expectDryRunIndicatorVisible()
})

Then('I see no dry-run indicator', async function () {
    await this.quizWelcomePage.expectDryRunIndicatorNotVisible()
})
