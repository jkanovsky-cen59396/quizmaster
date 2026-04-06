import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useApi } from '#fe/api/hooks'
import { fetchWorkspaceQuestion, type QuestionApiData, updateQuestion } from '#fe/api/question.ts'
import type { Question } from '#fe/model/question.ts'
import { Page } from '#fe/pages/components/page.tsx'
import { urls, useWorkspaceId } from '#fe/urls.ts'

import { QuestionEditForm } from './form/question-form.tsx'

export function EditQuestionPage() {
    const workspaceId = useWorkspaceId()
    const params = useParams()
    const questionId = params.id || ''

    const [question, setQuestion] = useState<Question | undefined>(undefined)

    useApi(questionId, id => fetchWorkspaceQuestion(workspaceId, id), setQuestion)
    const navigate = useNavigate()

    const handleSubmit = (questionData: QuestionApiData) => {
        updateQuestion(workspaceId, question?.id ?? 0, questionData).then(() => {
            navigate(urls.workspace(workspaceId))
        })
    }

    return (
        <Page title="Edit Question" id="edit-question-page">
            {question && <QuestionEditForm question={question} onSubmit={handleSubmit} />}
        </Page>
    )
}
