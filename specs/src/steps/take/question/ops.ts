import { isNumericalSpec } from '#steps/shared/specs.ts'
import type { QuizmasterWorld } from '#steps/world'

const findQuestionByText = (world: QuizmasterWorld, text: string) =>
    Object.values(world.questionBookmarks).find(q => q.text === text)

export const answerQuestion = async (world: QuizmasterWorld, answerList: string) => {
    if (world.lastAnsweredTitle) {
        const feedbackVisible = await world.takeQuestionPage.questionFeedbackLocator().isVisible()
        if (!feedbackVisible) {
            await world.takeQuestionPage.expectQuestionTextNotToBe(world.lastAnsweredTitle)
        }
    }
    await world.takeQuestionPage.waitForLoaded()
    const title = (await world.takeQuestionPage.questionText()) ?? ''
    world.lastAnsweredTitle = title
    const question = findQuestionByText(world, title)
    if (question && isNumericalSpec(question)) {
        await world.takeQuestionPage.fillNumericalAnswer(answerList)
        return
    }
    const answers = world.parseAnswers(answerList)
    for (const answer of answers) {
        await world.takeQuestionPage.selectAnswer(answer)
    }
    await world.takeQuestionPage.submit()
}
