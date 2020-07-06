import fs from 'fs'

import GetSettingsDownNotes from '../controllers/GetSettingsDownNotes'
import ISettingsGoiania from '../models/ISettingsGoiania'

const mountFolder = (settings: ISettingsGoiania, folder: string) => {
    const folderSplit = folder.split('/')
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
        } else {
            folderComplete += `${field}/`
        }
        fs.existsSync(folderComplete) || fs.mkdirSync(folderComplete)
    }
    return folderComplete
}

const createFolderToSaveData = async (settings: ISettingsGoiania): Promise<string> => {
    const getSettingsDownNotes = new GetSettingsDownNotes()
    const settingsDown = await getSettingsDownNotes.getSettings()
    const { folderToSaveLogGoiania, folderToSaveXMLsGoiania } = settingsDown
    let folder = ''

    if (settings.typeLog === 'success') {
        folder = mountFolder(settings, folderToSaveXMLsGoiania)
    } else if (settings.typeLog === 'error' || settings.typeLog === 'warning') {
        folder = mountFolder(settings, folderToSaveLogGoiania)
    }

    return folder
}

export default createFolderToSaveData