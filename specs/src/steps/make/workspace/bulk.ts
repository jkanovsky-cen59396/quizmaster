import type { DataTable } from '@cucumber/cucumber'

import { Given } from '#steps/fixture.ts'
import { createQuestion } from '#steps/make/question/ops.ts'
import { parseQuestionRow } from '#steps/shared/parsers.ts'
import { createWorkspace } from '#steps/workspace/ops.ts'

Given('workspace {string} with questions', async function (name: string, data: DataTable) {
    await createWorkspace(this, name)

    for (const row of data.hashes()) {
        await createQuestion(this, parseQuestionRow(row))
    }
})
