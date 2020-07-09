import fs from 'fs'
import path from 'path'
import { Page } from 'puppeteer'

import SaveLogPrefGoiania from '../../controllers/SaveLogPrefGoiania'
import ISettingsGoiania from '../../models/ISettingsGoiania'
import createFolderToSaveData from '../../utils/CreateFolderToSaveData'
import TreatsMessageLog from './TreatsMessageLog'

const SaveXML = async (page: Page, settings: ISettingsGoiania, content: string): Promise<void> => {
    settings.typeLog = 'success'
    settings.messageLog = 'SaveXML'
    settings.messageError = ''
    let pathNote = await createFolderToSaveData(settings)
    pathNote = path.join(pathNote, `${settings.dayInitialMonth}ao${settings.dayFinalMonth}_${settings.month}${settings.year}.xml`)
    let existError = false
    fs.writeFile(pathNote, `<geral>${content}</geral>`, async (error) => {
        if (error) {
            existError = true
            console.log('\t\t[Final-Empresa-Mes] - Erro ao salvar XML')
            console.log('\t\t-------------------------------------------------')
            settings.typeLog = 'error'
            settings.messageError = error.message

            const treatsMessageLog = new TreatsMessageLog(page, settings)
            await treatsMessageLog.saveLog()
        }
    })

    if (!existError) {
        const saveLogPrefGoiania = new SaveLogPrefGoiania()
        await saveLogPrefGoiania.saveLog({
            prefGoianiaAccess: settings.idUser,
            hourLog: settings.hourLog,
            typeLog: settings.typeLog || 'success',
            messageLog: settings.messageLog || '',
            messageError: settings.messageError,
            urlImageDown: '',
            codeCompanie: settings.codeCompanie,
            nameCompanie: settings.companie,
            inscricaoMunicipal: settings.inscricaoMunicipal,
            dateStartDown: settings.dateStartDown,
            dateEndDown: settings.dateEndDown
        })
    }
}

export default SaveXML