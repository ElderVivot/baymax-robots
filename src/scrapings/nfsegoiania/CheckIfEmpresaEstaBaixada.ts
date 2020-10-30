import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const CheckIfEmpresaEstaBaixada = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.waitFor('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt149_block_wtContent1_wtLinks')
        let aviso = await page.evaluate(() => {
            return document.querySelector('#GoianiaTheme_wtTelaPrincipal_block_wtMainContent_WebPatterns_wt149_block_wtContent1_wtLinks > div:nth-child(1)')?.textContent
        })
        aviso = aviso ? aviso.normalize('NFD').replace(/[^a-zA-Z/ ]/g, '').toUpperCase() : ''
        if (aviso.indexOf('SITUACAO BAIXA') >= 0 || aviso.indexOf('SITUACAO SUSPENSAO') >= 0) {
            throw 'BAIXADA_SUSPENSA'
        }
    } catch (error) {
        settings.typeLog = 'error'
        if (error === 'BAIXADA_SUSPENSA') {
            console.log('\t[Final-Empresa] - Esta empresa está com situação "Baixada/Suspensa" na prefeitura. Fechando aba.')
            settings.typeLog = 'warning'
            settings.messageLogToShowUser = 'Empresa com a situação "Baixada/Suspensa" na prefeitura.'
        } else {
            console.log('\t[Final-Empresa] - Erro ao verificar se a empresa está com o status "Baixa"')
            settings.messageLogToShowUser = 'Erro ao checar o status da empresa na prefeitura.'
        }
        console.log('\t-------------------------------------------------')
        settings.messageLog = 'CheckIfEmpresaEstaBaixada'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default CheckIfEmpresaEstaBaixada