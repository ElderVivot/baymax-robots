import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const ClickListarXML = async (page: Page, settings: ISettingsGoiania, newPagePromise: Promise<Page>): Promise<void> => {
    try {
        const frame = page.frames().find(frame => frame.name() === 'cpo')
        if (frame) {
            await frame.waitFor('[value=Listar]')
            await frame.click('[value=Listar]')
        } else {
            throw 'NOT_FOUND_FRAME_CPO'
        }
        const popup = await newPagePromise
        await page.goto(popup.url(), { waitUntil: 'load', timeout: 6000000 }) // aguarda até 60 minutos carregar a página pra fazer o download
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao listar os XMLs')
        console.log('\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'ClickListarXML'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default ClickListarXML