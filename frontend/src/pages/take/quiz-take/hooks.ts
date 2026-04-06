import { useState } from 'react'
import { useParams } from 'react-router'

import { useApi } from '#api/hooks.ts'
import { fetchQuiz } from '#api/quiz.ts'
import type { Quiz } from '#model/quiz.ts'

export const useQuizApi = () => {
    const params = useParams()
    const quizId = params.id

    const [quiz, setQuiz] = useState<Quiz>()
    useApi(quizId, fetchQuiz, setQuiz)

    return quiz
}
