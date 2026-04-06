import { BrowserRouter, Route, Routes } from 'react-router'

import { ROUTES } from '#fe/urls.ts'
import { CreateQuestionPage } from '#pages/make/create-question/create-question-page.tsx'
import { EditQuestionPage } from '#pages/make/create-question/edit-question-page.tsx'
import { WorkspaceCreatePage } from '#pages/make/create-workspace/workspace-create-page.tsx'
import { HomePage } from '#pages/make/home.tsx'
import { QuizStatsPage } from '#pages/make/quiz-stats/quiz-stats-page.tsx'
import { QuizEditPage } from '#pages/make/quiz/quiz-edit-page.tsx'
import { WorkspacePage } from '#pages/make/workspace/workspace.tsx'
import { QuestionTakePage } from '#pages/take/question-take'
import { QuizTakePage } from '#pages/take/quiz-take/quiz-take-page.tsx'
import { QuizWelcomePage } from '#pages/take/quiz-take/quiz-welcome/quiz-welcome-page.tsx'

export const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />

            {/* Public question taking */}
            <Route path={ROUTES.questionTake} element={<QuestionTakePage />} />

            {/* Workspace */}
            <Route path={ROUTES.workspaceNew} element={<WorkspaceCreatePage />} />
            <Route path={ROUTES.workspace} element={<WorkspacePage />} />
            <Route path={ROUTES.workspaceQuestionNew} element={<CreateQuestionPage />} />
            <Route path={ROUTES.workspaceQuestionEdit} element={<EditQuestionPage />} />

            {/* Quiz management (workspace-scoped) */}
            <Route path={ROUTES.workspaceQuizNew} element={<QuizEditPage />} />
            <Route path={ROUTES.workspaceQuizEdit} element={<QuizEditPage />} />
            <Route path={ROUTES.workspaceQuizStats} element={<QuizStatsPage />} />

            {/* Quiz taking (public) */}
            <Route path={ROUTES.quizWelcome} element={<QuizWelcomePage />} />
            <Route path={ROUTES.quizTake} element={<QuizTakePage />} />
        </Routes>
    </BrowserRouter>
)
