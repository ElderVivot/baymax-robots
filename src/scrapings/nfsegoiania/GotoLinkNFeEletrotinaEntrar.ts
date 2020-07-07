import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const GotoLinkNFeEletrotinaEntrar = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.waitFor('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt157_block_wtContent1_wt54_WebPatterns_wt70_block_wtContent_wt298')

        const urlButtonEntrar = await page.evaluate(
            () => document.querySelector('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt157_block_wtContent1_wt54_WebPatterns_wt70_block_wtContent_wt298')?.getAttribute('href')
        )
        if (urlButtonEntrar) {
            page.on('dialog', async dialog => {
                await dialog.accept()
            })
            await page.goto(urlButtonEntrar)
        }
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao abrir o link do "NF-e Eletrônica" e passar pelo Alert')
        console.log('\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'GotoLinkNFeEletrotinaEntrar'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default GotoLinkNFeEletrotinaEntrar