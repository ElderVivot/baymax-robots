import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const SerializeXML = async (page: Page, settings: ISettingsGoiania, contentXML: string): Promise<string> => {
    try {
        return contentXML.replace(/[^a-zA-Z0-9.'"!+:><=)?$(*,-_ \\]/g, '')
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao retirar caracteres inválidos XML')
        console.log('\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'SerializeXML'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()

        return ''
    }
}

export default SerializeXML