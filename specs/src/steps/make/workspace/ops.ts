import { createWorkspaceViaRest } from '#steps/shared/api.ts'
import type { QuizmasterWorld } from '#steps/world'

export const openCreateWorkspacePage = async (world: QuizmasterWorld) => {
    await world.workspaceCreatePage.gotoNew()
}

export const createWorkspace = async (world: QuizmasterWorld, name: string) => {
    world.workspaceGuid = await createWorkspaceViaRest(world, name)
    await world.page.goto(`/workspace/${world.workspaceGuid}`)
}

export const ensureWorkspaceGuid = async (world: QuizmasterWorld) => {
    if (!world.workspaceGuid) {
        world.workspaceGuid = await createWorkspaceViaRest(world, 'Default Workspace')
    }
}

export const ensureWorkspace = async (world: QuizmasterWorld) => {
    await ensureWorkspaceGuid(world)
    const path = `/workspace/${world.workspaceGuid}`
    if (!world.page.url().endsWith(path)) {
        await world.page.goto(path)
    }
}
