import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const ClickNFeEletronica = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.waitFor('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt160_block_wtContent1_wt57_WebPatterns_wt373_block_wtContent_WebPatterns_wt480_block_wtText_wtNFEletronica')
        await page.click('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt160_block_wtContent1_wt57_WebPatterns_wt373_block_wtContent_WebPatterns_wt480_block_wtText_wtNFEletronica')
    } catch (error) {
        console.log('\t\t[Final-Empresa-Mes] - Erro ao clicar no botão "NF-e Eletrônica"')
        console.log('\t\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'ClickNFeEletronica'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao clicar no botão "NF-e Eletrônica".'

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default ClickNFeEletronica