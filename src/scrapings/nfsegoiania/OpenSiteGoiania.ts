import path from 'path'
import { Browser, Page } from 'puppeteer'

import SaveLogPrefGoiania from '../../controllers/SaveLogPrefGoiania'
import ISettingsGoiania from '../../models/ISettingsGoiania'
import createFolderToSaveData from '../../utils/CreateFolderToSaveData'

const OpenSiteGoiania = async (page: Page, browser: Browser, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.goto('https://www10.goiania.go.gov.br/Internet/Login2.aspx', { timeout: 10000 })
        const textButtonEntrar = await page.evaluate(() => {
            return document.querySelector('#wt38_wtLoginContent_wt8')?.getAttribute('value')
        })
        if (!textButtonEntrar) {
            throw 'NOT_PAGE_CORRECT'
        }
    } catch (error) {
        if (error === 'NOT_PAGE_CORRECT') {
            console.log('[Final-Loguin] - Página de Goiânia não Encontrada')
        } else {
            console.log('[Final-Loguin] - Erro ao abrir site de Goiânia')
        }
        settings.typeLog = 'error'
        let pathImg = await createFolderToSaveData(settings)
        pathImg = path.resolve(pathImg, 'OpenSiteGoiania.png')
        await page.screenshot({ path: pathImg })
        await browser.close()

        const messageLog = 'Error-OpenSiteGoiania'

        const saveLogPrefGoiania = new SaveLogPrefGoiania()
        await saveLogPrefGoiania.saveLog({
            prefGoianiaAccess: settings.idUser,
            hourLog: settings.hourLog,
            messageLog,
            messageError: error,
            typeLog: settings.typeLog,
            urlImageDown: pathImg
        })

        throw messageLog
    }
}

export default OpenSiteGoiania