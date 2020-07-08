import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import checkIfLoadedThePage from '../../utils/CheckIfLoadedThePage'
import TreatsMessageLog from './TreatsMessageLog'

const SelectPeriodToDownload = async (page: Page, settings: ISettingsGoiania): Promise<void> => {
    try {
        await checkIfLoadedThePage(page, 'cpo', true)
        const frame = page.frames().find(frame => frame.name() === 'cpo')
        if (frame) {
            await frame.waitFor('[name=txt_dia_inicial]')
            await frame.select('[name=txt_dia_inicial]', '01')
            await frame.select('[name=txt_dia_final]', '31')
            await frame.select('[name=sel_mes]', '05')
            await frame.type('[name=txt_ano]', '2020')
        } else {
            throw 'NOT_FOUND_FRAME_CPO'
        }
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao selecionar o período')
        console.log('\t-------------------------------------------------')
        settings.typeLog = 'error'
        settings.messageLog = 'SelectPeriodToDownload'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings)
        await treatsMessageLog.saveLog()
    }
}

export default SelectPeriodToDownload