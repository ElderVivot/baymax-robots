import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const ClickNFeEletronica = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.waitFor('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt157_block_wtContent1_wt54_WebPatterns_wt370_block_wtContent_WebPatterns_wt477_block_wtText_wtNFEletronica')
        await page.click('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt157_block_wtContent1_wt54_WebPatterns_wt370_block_wtContent_WebPatterns_wt477_block_wtText_wtNFEletronica')
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao clicar no botão "NF-e Eletrônica"')
        console.log('\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'ClickNFeEletronica'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default ClickNFeEletronica