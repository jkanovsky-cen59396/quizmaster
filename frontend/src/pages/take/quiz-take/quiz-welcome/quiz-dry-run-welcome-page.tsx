import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useApi } from '#api/hooks.ts'
import { fetchQuiz } from '#api/quiz.ts'
import { useWorkspaceId } from '#fe/urls.ts'
import type { Quiz } from '#model/quiz.ts'

import { DryRunIndicator } from '../dry-run-indicator.tsx'
import { QuizDetails } from './quiz-details.tsx'

export const QuizDryRunWelcomePage = () => {
    const navigate = useNavigate()
    const params = useParams()
    const workspaceId = useWorkspaceId()
    const [quiz, setQuiz] = useState<Quiz>()

    useApi(params.id, fetchQuiz, setQuiz)

    const onStart = () => {
        if (!quiz) return
        navigate(`/workspace/${workspaceId}/quiz/${quiz.id}/dry-run/questions`)
    }

    return (
        quiz && (
            <>
                <DryRunIndicator />
                <QuizDetails quiz={quiz} canStart={true} onStart={onStart} />
            </>
        )
    )
}
