import { Given, When, Then } from '#steps/fixture.ts'
import type { QuizmasterWorld } from '#steps/world/world.ts'

Given('I am on the home page', async function (this: QuizmasterWorld) {
    await this.homePage.goto()
    await this.homePage.waitForLoaded()
})

When('I start creating a new workspace', async function () {
    await this.homePage.createWorkspaceLink().click()
})

Then('I can create a new workspace', async function (this: QuizmasterWorld) {
    await this.homePage.expectCreateWorkspaceLinkVisible()
})
