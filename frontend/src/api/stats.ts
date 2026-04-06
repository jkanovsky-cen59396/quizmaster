import type { AttemptRequest, AttemptPatchRequest, AttemptResponse, QuizStatsResponse } from '#model/stats.ts'

import { fetchJson, patchJson, postJson } from './helpers.ts'

export const createAttempt = async (request: AttemptRequest): Promise<AttemptResponse> => {
    return await postJson<AttemptRequest, AttemptResponse>('/api/attempt', request)
}

export const patchAttempt = async (id: number, patch: AttemptPatchRequest): Promise<AttemptResponse> => {
    return await patchJson<AttemptPatchRequest, AttemptResponse>(`/api/attempt/${id}`, patch)
}

export const fetchQuizStats = async (workspaceGuid: string, quizId: string): Promise<QuizStatsResponse> => {
    return await fetchJson<QuizStatsResponse>(`/api/workspaces/${workspaceGuid}/quizzes/${quizId}/stats`)
}
