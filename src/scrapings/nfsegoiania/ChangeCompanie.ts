import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const ChangeCompanie = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.waitFor('#GoianiaTheme_wtTelaPrincipal_block_wtActions_SISEGIntegration_wt104_block_wtAcessos')
        await page.select('#GoianiaTheme_wtTelaPrincipal_block_wtActions_SISEGIntegration_wt104_block_wtAcessos', settings.valueLabelSite || '')
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao clicar no botão "NF-e Eletrônica"')
        console.log('\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'ChangeCompanie'
        settings.messageError = error
        settings.messageLogToShowUser = 'Erro ao realizar a troca de empresa.'

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default ChangeCompanie