import { Given } from '#steps/fixture.ts'
import { createWorkspace } from '#steps/workspace/ops.ts'

Given('workspace {string}', async function (name: string) {
    await createWorkspace(this, name)
})
