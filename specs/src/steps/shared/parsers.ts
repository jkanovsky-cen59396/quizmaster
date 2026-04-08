import type { AnswerSpec, QuestionSpec } from '#steps/shared/specs.ts'

const NUMERICAL_PATTERN = /^(-?\d+(?:\.\d+)?)\s*±\s*(\d+(?:\.\d+)?)$/

export const parseAnswers = (answersStr: string): AnswerSpec[] =>
    answersStr.split(',').map(raw => {
        const trimmed = raw.trim()
        const correct = trimmed.endsWith('(*)')
        return {
            text: correct ? trimmed.slice(0, -3).trimEnd() : trimmed,
            correct,
        }
    })

export const parseQuestionRow = (row: Record<string, string | undefined>): QuestionSpec => {
    const text = row.question ?? ''
    const bookmark = row.bookmark || text
    const numericalMatch = row.answers?.match(NUMERICAL_PATTERN)

    if (numericalMatch) {
        const [, numericalAnswer, tolerance] = numericalMatch
        return {
            text,
            bookmark,
            answers: [],
            numericalAnswer,
            tolerance,
            explanation: row.explanation,
        }
    }

    return {
        text,
        bookmark,
        answers: parseAnswers(row.answers ?? ''),
        easy: row.easy === 'true',
        explanation: row.explanation,
        image: row.image,
        tag: row.tag,
    }
}
