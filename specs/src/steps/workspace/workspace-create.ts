import { Given, When, Then } from '#steps/fixture.ts'
import { openCreateWorkspacePage } from '#steps/workspace/ops.ts'

Given('I start creating a workspace', async function () {
    await openCreateWorkspacePage(this)
})

Given('home page', async function () {
    await this.homePage.goto()
})

When('I enter workspace name {string}', async function (name: string) {
    await this.workspaceCreatePage.enterWorkspaceName(name)
})

When('I start creating a new workspace', async function () {
    await this.homePage.createWorkspaceLink().click()
})

When('I submit the workspace', async function () {
    await this.workspaceCreatePage.submit()
})

When('I go back to the home page', async function () {
    await this.workspaceCreatePage.back()
})

Then('I see the workspace creation page', async function () {
    await this.workspaceCreatePage.expectCreatePageVisible()
})
