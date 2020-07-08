import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const OpenCompanieInNewPage = async (page: Page, settings: ISettingsGoiania, url: string): Promise<void> => {
    try {
        await page.goto(url)
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao clicar no botão "NF-e Eletrônica"')
        console.log('\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'OpenCompanieInNewPage'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default OpenCompanieInNewPage