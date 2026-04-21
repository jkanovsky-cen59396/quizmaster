import { ensureWorkspaceGuid } from '#steps/make/workspace/ops.ts'
import { createQuizViaRest } from '#steps/shared/api.ts'
import type { QuizSpec } from '#steps/shared/specs.ts'
import type { QuizmasterWorld } from '#steps/world'

export const createQuiz = async (world: QuizmasterWorld, spec: QuizSpec) => {
    await ensureWorkspaceGuid(world)
    const id = await createQuizViaRest(world, world.workspaceGuid, spec)
    world.bookmarkQuiz(spec.bookmark ?? spec.name, `/quiz/${id}`)

    // Re-load the workspace page so its quiz list reflects the REST-inserted quiz.
    // Several downstream GUI steps (e.g. "I see the quiz X in the workspace", "I take
    // quiz X", "I navigate to edit quiz X") read from whatever page is currently loaded.
    await world.page.goto(`/workspace/${world.workspaceGuid}`)
}
