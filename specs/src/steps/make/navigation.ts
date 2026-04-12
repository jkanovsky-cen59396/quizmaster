import { When } from '#steps/fixture.ts'

When('I navigate back to the workspace', async function () {
    await this.pageNavigation.back()
})
