import type { QuestionSpec } from '#steps/shared/specs.ts'
import type { QuizmasterWorld } from '#steps/world'

export const createWorkspaceViaRest = async (world: QuizmasterWorld, name: string): Promise<string> => {
    const response = await world.page.request.post('/api/workspaces', {
        data: { title: name },
    })
    if (!response.ok()) {
        throw new Error(`POST /api/workspaces failed: ${response.status()} ${await response.text()}`)
    }
    const { guid } = (await response.json()) as { guid: string }
    return guid
}

type QuestionType = 'single' | 'multiple' | 'numerical'

interface QuestionPayload {
    question: string
    answers: string[]
    correctAnswers: number[]
    explanations: string[]
    questionExplanation?: string
    questionType: QuestionType
    isEasy: boolean
    imageUrl?: string
    tolerance?: number
    tags?: string[]
}

const toNumericalPayload = (spec: QuestionSpec): QuestionPayload => {
    const parsedTolerance = spec.tolerance ? Number.parseFloat(spec.tolerance) : undefined
    const tolerance = parsedTolerance !== undefined && Number.isNaN(parsedTolerance) ? undefined : parsedTolerance
    return {
        question: spec.text,
        answers: [spec.numericalAnswer as string],
        correctAnswers: [0],
        explanations: [''],
        questionExplanation: spec.explanation,
        questionType: 'numerical',
        isEasy: false,
        tolerance,
        tags: spec.tag ? [spec.tag] : undefined,
    }
}

const toChoicePayload = (spec: QuestionSpec): QuestionPayload => {
    const answers = spec.answers.map(a => a.text)
    const correctAnswers = spec.answers.flatMap((a, i) => (a.correct ? [i] : []))
    const explanations = spec.answers.map(a => a.explanation ?? '')
    const questionType: QuestionType = correctAnswers.length > 1 ? 'multiple' : 'single'
    return {
        question: spec.text,
        answers,
        correctAnswers,
        explanations,
        questionExplanation: spec.explanation,
        questionType,
        isEasy: spec.easy ?? false,
        imageUrl: spec.image,
        tags: spec.tag ? [spec.tag] : undefined,
    }
}

const toQuestionPayload = (spec: QuestionSpec): QuestionPayload =>
    spec.numericalAnswer !== undefined ? toNumericalPayload(spec) : toChoicePayload(spec)

export const createQuestionViaRest = async (
    world: QuizmasterWorld,
    workspaceGuid: string,
    spec: QuestionSpec,
): Promise<number> => {
    const url = `/api/workspaces/${workspaceGuid}/questions`
    const response = await world.page.request.post(url, {
        data: toQuestionPayload(spec),
    })
    if (!response.ok()) {
        throw new Error(`POST ${url} failed: ${response.status()} ${await response.text()}`)
    }
    const { id } = (await response.json()) as { id: number }
    return id
}
