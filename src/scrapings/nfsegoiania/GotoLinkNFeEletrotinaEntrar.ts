import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const GotoLinkNFeEletrotinaEntrar = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.waitFor('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt160_block_wtContent1_wt57_WebPatterns_wt72_block_wtContent_wt300')

        const urlButtonEntrar = await page.evaluate(
            () => document.querySelector('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt160_block_wtContent1_wt57_WebPatterns_wt72_block_wtContent_wt300')?.getAttribute('href')
        )
        if (urlButtonEntrar) {
            page.on('dialog', async dialog => {
                await dialog.accept()
            })
            await page.goto(urlButtonEntrar, { timeout: 200000 })
        }
    } catch (error) {
        console.log('\t\t[Final-Empresa-Mes] - Erro ao abrir o link do "NF-e Eletrônica" e passar pelo Alert')
        console.log('\t\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'GotoLinkNFeEletrotinaEntrar'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao abrir o link de "NF-e Eletrônica" e passar pelo Alert.'

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default GotoLinkNFeEletrotinaEntrar