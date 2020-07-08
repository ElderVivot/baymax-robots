import fs from 'fs'
import path from 'path'
import { Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import createFolderToSaveData from '../../utils/CreateFolderToSaveData'
import TreatsMessageLog from './TreatsMessageLog'

const SaveXML = async (page: Page, settings: ISettingsGoiania, content: string): Promise<void> => {
    settings.typeLog = 'success'
    settings.messageLog = 'SaveXML'
    let pathNote = await createFolderToSaveData(settings)
    pathNote = path.join(pathNote, `${settings.cgceCompanie}.xml`)
    fs.writeFile(pathNote, `<geral>${content}</geral>`, async (error) => {
        if (error) {
            console.log('\t[Final-Empresa] - Erro ao salvar XML')
            console.log('\t-------------------------------------------------')
            settings.typeLog = 'error'
            settings.messageError = error.message

            const treatsMessageLog = new TreatsMessageLog(page, settings)
            await treatsMessageLog.saveLog()
        }
    })
}

export default SaveXML