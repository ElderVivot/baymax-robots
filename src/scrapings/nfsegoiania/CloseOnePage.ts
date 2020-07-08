import { Page } from 'puppeteer'

const CloseOnePage = async (page: Page): Promise<void> => {
    try {
        await page.close()
        console.log('\t[Final-Empresa] - Fechando aba')
        console.log('\t-------------------------------------------------')
    } catch (error) {
        console.log(error)
    }
}

export default CloseOnePage