import { ensureWorkspace, navigateToWorkspace } from '#steps/make/workspace/ops.ts'
import {
    hasExplanations,
    isMultipleChoiceSpec,
    isNumericalSpec,
    type AnswerSpec,
    type QuestionSpec,
} from '#steps/shared/specs.ts'
import type { QuizmasterWorld } from '#steps/world'

// Mirrors the default count of empty answer rows shown by the question form.
// If you change this, also change in frontend/src/pages/create-question/create-question.tsx
const NUM_DEFAULT_ANSWERS = 2

// ── Form helpers ────────────────────────────────────────
// These drive the UI and optionally track changes in questionWip when it is
// set (builder chain, GUI edit). The createQuestion pipeline does NOT set
// questionWip — it bookmarks the spec directly.

export const enterQuestion = async (world: QuizmasterWorld, question: string) => {
    await world.questionEditPage.enterQuestion(question)
    if (world.questionWip) world.questionWip.text = question
}

export const enterTag = async (world: QuizmasterWorld, tag: string) => {
    await world.questionEditPage.enterTag(tag)
    if (world.questionWip) world.questionWip.tag = tag
}

export const enterAIPrompt = async (world: QuizmasterWorld, prompt: string) => {
    await world.questionEditPage.enterAIPrompt(prompt)
}

export const enterAnswerText = async (world: QuizmasterWorld, index: number, answer: string) => {
    await world.questionEditPage.enterAnswerText(index, answer)
    if (world.questionWip) {
        const wip = world.questionWip
        wip.answers[index] = { ...wip.answers[index], text: answer }
    }
}

export const markAnswerCorrectness = async (world: QuizmasterWorld, index: number, isCorrect: boolean) => {
    await world.questionEditPage.setAnswerCorrectness(index, isCorrect)
    if (world.questionWip) {
        const wip = world.questionWip
        wip.answers[index] = { ...wip.answers[index], correct: isCorrect }
    }
}

export const enterAnswerExplanation = async (world: QuizmasterWorld, index: number, explanation: string) => {
    await world.questionEditPage.enterAnswerExplanation(index, explanation)
    if (world.questionWip) {
        const wip = world.questionWip
        wip.answers[index] = { ...wip.answers[index], explanation }
    }
}

export const enterAnswer = async (
    world: QuizmasterWorld,
    index: number,
    answer: string,
    isCorrect: boolean,
    explanation: string | undefined,
) => {
    await world.questionEditPage.enterAnswer(index, answer, isCorrect, explanation)
    if (world.questionWip) {
        world.questionWip.answers[index] = { text: answer, correct: isCorrect, explanation }
    }
}

export const enterQuestionExplanation = async (world: QuizmasterWorld, explanation: string) => {
    await world.questionEditPage.enterQuestionExplanation(explanation)
    if (world.questionWip) world.questionWip.explanation = explanation
}

export const enterImageUrl = async (world: QuizmasterWorld, imageUrl: string) => {
    await world.questionEditPage.enterImageUrl(imageUrl)
    if (world.questionWip) world.questionWip.image = imageUrl
}

export async function submitQuestion(this: QuizmasterWorld) {
    await this.questionEditPage.submit()
}

// ── Compound form operations ────────────────────────────

export const addAnswers = async (world: QuizmasterWorld, answers: AnswerSpec[]) => {
    if (answers.length === 0) return

    const editPage = world.questionEditPage

    if (isMultipleChoiceSpec(answers)) await editPage.setMultipleChoice()

    if (hasExplanations(answers)) await editPage.enableExplanations()

    for (let i = 0; i < answers.length; i++) {
        if (i >= NUM_DEFAULT_ANSWERS) await editPage.addAdditionalAnswer()
        const a = answers[i]
        await enterAnswer(world, i, a.text, a.correct, a.explanation)
    }
}

// ── createQuestion pipeline ─────────────────────────────

export const createQuestion = async (world: QuizmasterWorld, spec: QuestionSpec) => {
    const savedWip = world.questionWip
    world.questionWip = undefined

    await ensureWorkspace(world)
    await navigateToWorkspace(world)
    await world.workspacePage.createNewQuestion()

    await enterQuestion(world, spec.text)

    if (isNumericalSpec(spec)) {
        await world.questionEditPage.setNumericalChoice()
        await world.questionEditPage.enterNumericalCorrectAnswer(spec.numericalAnswer as string)
        if (spec.tolerance) await world.questionEditPage.enterNumericalTolerance(spec.tolerance)
    } else {
        if (spec.tag) await enterTag(world, spec.tag)
        await addAnswers(world, spec.answers)
        if (spec.easy) await world.questionEditPage.setEasy()
    }

    if (spec.explanation) await enterQuestionExplanation(world, spec.explanation)
    if (spec.image) await enterImageUrl(world, spec.image)

    world.bookmarkQuestion(spec.bookmark ?? spec.text, spec)

    await world.questionEditPage.submit()
    await world.workspacePage.waitForUrl(world.workspaceGuid)

    world.questionWip = savedWip
}
