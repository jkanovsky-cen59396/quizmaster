export enum AttemptStatus {
    FINISHED = 'FINISHED',
    IN_PROGRESS = 'IN_PROGRESS',
    TIMEOUT = 'TIMEOUT',
}

export interface StatsRecord {
    readonly id: number
    readonly quizId: number
    readonly durationSeconds: number
    readonly points: number
    readonly score: number
    readonly status: AttemptStatus
    readonly maxScore: number
    readonly startedAt: string
    readonly finishedAt: string | null
}

export interface AttemptRequest {
    readonly quizId: number
    readonly durationSeconds: number
    readonly points: number
    readonly score: number
    readonly status: AttemptStatus
    readonly maxScore: number
    readonly startedAt: string
    readonly finishedAt: string | null
}

export interface AttemptPatchRequest {
    readonly correctAnswers?: number
    readonly incorrectAnswers?: number
}

export interface AttemptStatsRecord {
    readonly id: number
    readonly durationSeconds: number | null
    readonly correctAnswers: number
    readonly incorrectAnswers: number
    readonly totalQuestions: number
    readonly score: number
    readonly status: string
}

export interface SummaryStats {
    readonly started: number
    readonly finished: number
    readonly unfinished: number
    readonly timeout: number
}

export interface QuizStatsResponse {
    readonly summary: SummaryStats
    readonly attempts: readonly AttemptStatsRecord[]
}

export type Stats = readonly StatsRecord[]
