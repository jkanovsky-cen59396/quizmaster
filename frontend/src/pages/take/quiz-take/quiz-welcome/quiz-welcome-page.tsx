import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useApi } from '#api/hooks.ts'
import { fetchQuiz } from '#api/quiz.ts'
import { createAttempt } from '#api/stats.ts'
import { setQuizRunId } from '#fe/helpers.ts'
import type { Quiz } from '#model/quiz.ts'

import { QuizDetails } from './quiz-details.tsx'

export const QuizWelcomePage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>()

    useApi(params.id, fetchQuiz, setQuiz)

    const onStart = async () => {
        const quizId = params.id
        navigate(`/quiz/${quizId}/questions`)
        sessionStorage.removeItem('quizAnswers')

        if (quiz) {
            const attempt = await createAttempt({
                quizId: quiz.id,
                startedAt: new Date().toISOString(),
            })
            setQuizRunId(attempt.id)
        }
    }

    return quiz && <QuizDetails quiz={quiz} onStart={onStart} />
}
