import type { Page } from '@playwright/test'

export class PageNavigation {
    constructor(private page: Page) {}

    private backButtonLocator = () => this.page.locator('button#back')
    back = () => this.backButtonLocator().click()
}
