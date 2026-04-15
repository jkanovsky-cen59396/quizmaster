import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { patchAttempt } from '#api/stats.ts'
import { getStoredQuizRunId } from '#fe/helpers.ts'
import { urls } from '#fe/urls.ts'

import { useQuizApi } from './hooks.ts'
import type { QuizAnswers } from './quiz-answers-state.ts'
import { isQuizAvailable } from './quiz-availability.ts'
import { QuizScorePage } from './quiz-score-page.tsx'
import { QuestionForm } from './quiz.tsx'

export const QuizTakePage = () => {
    const quiz = useQuizApi()
    const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null)
    const navigate = useNavigate()
    const quizRunId = quiz ? getStoredQuizRunId(quiz.id) : null

    useEffect(() => {
        const stored = sessionStorage.getItem('quizAnswers')
        if (stored) {
            setQuizAnswers(JSON.parse(stored))
        }
    }, [])

    useEffect(() => {
        if (!quiz) return
        if (isQuizAvailable(quiz) && quizRunId !== null) return

        sessionStorage.removeItem('quizAnswers')
        navigate(urls.quizWelcome(quiz.id), { replace: true })
    }, [navigate, quiz, quizRunId])

    function updateSessionStorage(answers: QuizAnswers | null) {
        if (answers !== null) {
            sessionStorage.setItem('quizAnswers', JSON.stringify(answers))
        } else {
            sessionStorage.removeItem('quizAnswers')
        }
    }

    async function handleEvaluate(answers: QuizAnswers | null) {
        if (!quiz) return

        navigate(urls.quizTake(quiz.id))
        updateSessionStorage(answers)
        setQuizAnswers(answers)

        if (!answers || quizRunId === null) return

        await patchAttempt(quizRunId, {
            finishedAt: new Date().toISOString(),
        })
    }

    if (quiz && quizRunId !== null && isQuizAvailable(quiz)) {
        return quizAnswers ? (
            <QuizScorePage quiz={quiz} quizAnswers={quizAnswers} />
        ) : (
            <QuestionForm quiz={quiz} quizRunId={quizRunId} onEvaluate={handleEvaluate} />
        )
    }
}
