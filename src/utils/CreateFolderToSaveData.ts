import fs from 'fs'
import path from 'path'

import GetSettingsWayFiles from '../controllers/GetSettingsWayFiles'
import ISettingsGoiania from '../models/ISettingsGoiania'

const mountFolder = (settings: ISettingsGoiania, folder: string) => {
    let newFolder = folder
    if (folder.indexOf('\\') >= 0) {
        newFolder = folder.replace(/[\\]/g, '/')
    }

    const folderSplit = newFolder.split('/')
    let folderComplete = ''
    for (const field of folderSplit) {
        if (field === 'hourLog') {
            folderComplete += settings.dateHourProcessing ? `${settings.dateHourProcessing}/` : ''
        } else if (field === 'accessGoiania') {
            folderComplete += settings.loguin ? `${settings.loguin}/` : ''
        } else if (field === 'typeLog') {
            folderComplete += settings.typeLog ? `${settings.typeLog}/` : ''
        } else if (field === 'nameCompanieWithIM') {
            folderComplete += settings.companie && settings.inscricaoMunicipal ? `${settings.companie} - ${settings.inscricaoMunicipal}/` : ''
        } else if (field === 'nameCompanieWithCodeCompanie') {
            folderComplete += settings.companie && settings.codeCompanie ? `${settings.companie} - ${settings.codeCompanie}/` : ''
        } else if (field === 'year') {
            folderComplete += settings.year ? `${settings.year}/` : ''
        } else if (field === 'month') {
            folderComplete += settings.month ? `${settings.month}/` : ''
        } else if (field === 'EntradasOrSaidas') {
            folderComplete += settings.entradasOrSaidas ? `${settings.entradasOrSaidas}/` : ''
        } else if (field === 'typeNF') {
            folderComplete += settings.typeNF ? `${settings.typeNF}/` : ''
        } else if (field === 'codeCompanieWithNameCompanie') {
            folderComplete += settings.companie && settings.codeCompanie ? `${settings.codeCompanie} - ${settings.companie}/` : ''
        } else if (field === 'monthYearRotinaAutomatica') {
            folderComplete += settings.year && settings.month ? `${settings.month}${settings.year}/` : ''
        } else if (field === 'monthYear') {
            folderComplete += settings.year && settings.month ? `${settings.month}-${settings.year}/` : ''
        } else if (field === 'yearMonth') {
            folderComplete += settings.year && settings.month ? `${settings.year}-${settings.month}/` : ''
        } else {
            folderComplete += `${field}/`
        }
        fs.existsSync(folderComplete) || fs.mkdirSync(folderComplete)
    }
    return folderComplete
}

const createFolderToSaveData = async (settings: ISettingsGoiania, folderRoutineAutomactic = false): Promise<string> => {
    const getSettingsWayFiles = new GetSettingsWayFiles()
    const settingsDown = await getSettingsWayFiles.getSettings()
    const { folderToSaveXMLsGoiania, folderToSaveXMLsGoianiaRotinaAutomatica } = settingsDown
    const folderToSaveLogGoiania = path.resolve(__dirname, '..', 'logs')
    let folder = ''

    if (settings.typeLog === 'success') {
        folder = mountFolder(settings, folderToSaveXMLsGoiania)
        // when exists folderToSaveXMLsGoianiaRotinaAutomatica and I want to process folderRoutineAutomactic
        if (folderRoutineAutomactic) {
            if (folderToSaveXMLsGoianiaRotinaAutomatica) {
                folder = mountFolder(settings, folderToSaveXMLsGoianiaRotinaAutomatica)
            } else {
                return ''
            }
        }
    } else if (settings.typeLog === 'error' || settings.typeLog === 'warning') {
        folder = mountFolder(settings, folderToSaveLogGoiania)
    }

    return folder
}

export default createFolderToSaveData