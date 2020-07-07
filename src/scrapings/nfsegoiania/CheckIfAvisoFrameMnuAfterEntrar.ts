import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import checkIfLoadedThePage from '../../utils/CheckIfLoadedThePage'
import TreatsMessageLog from './TreatsMessageLog'

const CheckIfAvisoFrameMnuAfterEntrar = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    let aviso
    try {
        await checkIfLoadedThePage(page, 'mnu', true)
        const frame = page.frames().find(frame => frame.name() === 'mnu')
        await frame?.waitFor('tr[bgcolor=beige] > td > table > tbody > tr > td[align=center] > span')
        aviso = await frame?.evaluate(() => {
            return document.querySelector('tr[bgcolor=beige] > td > table > tbody > tr > td[align=center] > span')?.textContent
        })
        aviso = aviso ? aviso.normalize('NFD').replace(/[^a-zA-Z/ ]/g, '').toUpperCase() : ''
        if (aviso.trim() !== '') {
            throw 'NAO_HABILITADA_EMITIR_NFSE'
        }
    } catch (error) {
        settings.typeLog = 'error'
        if (error === 'NAO_HABILITADA_EMITIR_NFSE') {
            console.log(`\t[Final-Empresa] - Empresa não habilitada pra emitir NFS-e. O aviso é "${aviso}".`)
            settings.typeLog = 'warning'
        } else {
            console.log('\t[Final-Empresa] - Erro ao verificar se a empresa está habilitada pra emitir NFS-e Serviço')
        }
        console.log('\t-------------------------------------------------')
        settings.messageLog = 'CheckIfAvisoFrameMnuAfterEntrar'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default CheckIfAvisoFrameMnuAfterEntrar