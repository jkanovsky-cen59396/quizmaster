import type { QuizmasterWorld } from '#steps/world'

export const createWorkspaceViaRest = async (world: QuizmasterWorld, name: string): Promise<string> => {
    const response = await world.page.request.post('/api/workspaces', {
        data: { title: name },
    })
    if (!response.ok()) {
        throw new Error(`POST /api/workspaces failed: ${response.status()} ${await response.text()}`)
    }
    const { guid } = (await response.json()) as { guid: string }
    return guid
}
