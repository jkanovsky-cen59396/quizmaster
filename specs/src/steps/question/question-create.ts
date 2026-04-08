import type { DataTable } from '@cucumber/cucumber'

import { Given } from '#steps/fixture.ts'
import { parseAnswers } from '#steps/question/ops.ts'
import { createQuestionInAutoWorkspace } from '#steps/workspace/ops.ts'

Given('questions', async function (data: DataTable) {
    for (const row of data.hashes()) {
        const { bookmark, question, answers, easy, explanation } = row
        const isEasy = easy === 'true'
        const answerRawTable = parseAnswers(answers)

        await createQuestionInAutoWorkspace(this, bookmark, question, answerRawTable, isEasy, explanation)
    }
})
