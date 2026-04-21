import type { QuestionSpec, QuizSpec } from '#steps/shared/specs.ts'
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

type QuizModeValue = 'exam' | 'learn'
type DifficultyValue = 'easy' | 'hard' | 'keep-question'

interface QuizPayload {
    title: string
    description: string
    startAt: string | null
    endAt: string | null
    questionIds: number[]
    mode: QuizModeValue
    difficulty: DifficultyValue
    passScore: number
    timeLimit: number
    workspaceGuid: string
    randomQuestionCount: number
}

// Same format as the quiz form input: "60s", "5m", "2m30s".
const parseTimeLimitSeconds = (value: string): number => {
    const matchMs = value.match(/^(\d+)m(\d+)s$/i)
    if (matchMs) return Number(matchMs[1]) * 60 + Number(matchMs[2])
    const matchSm = value.match(/^(\d+)s(\d+)m$/i)
    if (matchSm) return Number(matchSm[1]) + Number(matchSm[2]) * 60
    const matchM = value.match(/^(\d+)m$/i)
    if (matchM) return Number(matchM[1]) * 60
    const matchS = value.match(/^(\d+)s$/i)
    if (matchS) return Number(matchS[1])
    const plain = Number(value)
    if (Number.isFinite(plain)) return plain
    throw new Error(`Unparseable time limit: "${value}"`)
}

const DIFFICULTY_MAP: Record<string, DifficultyValue> = {
    'Keep Question': 'keep-question',
    Easy: 'easy',
    Hard: 'hard',
}

const toDifficultyValue = (difficulty: string): DifficultyValue => {
    const result = DIFFICULTY_MAP[difficulty]
    if (!result) throw new Error(`Unknown difficulty: "${difficulty}"`)
    return result
}

const resolveQuestionIds = (world: QuizmasterWorld, bookmarks: readonly string[]): number[] =>
    bookmarks.map(bookmark => {
        const id = world.questionIds[bookmark]
        if (id === undefined) {
            throw new Error(`Question bookmark "${bookmark}" has no REST-assigned id`)
        }
        return id
    })

const toQuizPayload = (world: QuizmasterWorld, spec: QuizSpec): QuizPayload => ({
    title: spec.name,
    description: spec.description ?? '',
    startAt: spec.startAt ?? null,
    endAt: spec.endAt ?? null,
    questionIds: resolveQuestionIds(world, spec.questions),
    mode: (spec.mode ?? 'exam') as QuizModeValue,
    difficulty: spec.difficulty ? toDifficultyValue(spec.difficulty) : 'keep-question',
    passScore: spec.passScore ? Number.parseInt(spec.passScore, 10) : 80,
    timeLimit: spec.timeLimit ? parseTimeLimitSeconds(spec.timeLimit) : 600,
    workspaceGuid: world.workspaceGuid,
    randomQuestionCount: spec.size ? Number.parseInt(spec.size, 10) : 0,
})

export const createQuizViaRest = async (
    world: QuizmasterWorld,
    workspaceGuid: string,
    spec: QuizSpec,
): Promise<number> => {
    const url = `/api/workspaces/${workspaceGuid}/quizzes`
    const response = await world.page.request.post(url, {
        data: toQuizPayload(world, spec),
    })
    if (!response.ok()) {
        throw new Error(`POST ${url} failed: ${response.status()} ${await response.text()}`)
    }
    const { id } = (await response.json()) as { id: number }
    return id
}
