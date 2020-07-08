import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import checkIfLoadedThePage from '../../utils/CheckIfLoadedThePage'
import TreatsMessageLog from './TreatsMessageLog'

const GetCNPJPrestador = async (page: Page, settings: ISettingsGoiania): Promise<string> => {
    try {
        let cpfCnpj = ''
        await checkIfLoadedThePage(page, 'cpo', true)
        const frame = page.frames().find(frame => frame.name() === 'cpo')
        if (frame) {
            await frame.waitFor('#nr_cnpj')
            cpfCnpj = await frame.evaluate(() => {
                return document.querySelector('#nr_cnpj')?.textContent
            }) || ''
        }
        cpfCnpj = cpfCnpj.replace(/[^\d]+/g, '')
        // const { companies } = settings
        if (cpfCnpj === '') {
            throw 'IS_NOT_CLIENT'
        }
        return cpfCnpj
    } catch (error) {
        settings.typeLog = 'error'
        if (error === 'IS_NOT_CLIENT') {
            console.log('\t[14] - Empresa não é cliente desta Contabilidade neste período')
            settings.typeLog = 'warning'
        } else {
            console.log('\t[Final-Empresa] - Erro ao checar o CNPJ/CPF')
        }
        console.log('\t-------------------------------------------------')
        settings.messageLog = 'GetCNPJPrestador'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()

        return ''
    }
}

export default GetCNPJPrestador