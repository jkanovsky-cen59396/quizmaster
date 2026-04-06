import { useState } from 'react'
import { useParams } from 'react-router'

import { useApi } from '#fe/api/hooks.ts'
import { fetchQuiz } from '#fe/api/quiz.ts'
import { fetchStats } from '#fe/api/stats.ts'
import type { Quiz } from '#fe/model/quiz.ts'
import type { Stats } from '#fe/model/stats.ts'

import { QuizStats } from './quiz-stats-component.tsx'

export const QuizStatsPage = () => {
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>()
    const [stats, setStats] = useState<Stats>()

    useApi(params.id, fetchQuiz, setQuiz)
    useApi(params.id, fetchStats, setStats)

    return quiz && stats && <QuizStats quiz={quiz} stats={stats} />
}
