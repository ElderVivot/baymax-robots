import { Browser, Page } from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import TreatsMessageLog from './TreatsMessageLog'

const Loguin = async (page: Page, browser: Browser, settings: ISettingsGoiania): Promise<void> => {
    try {
        await page.waitFor('#wt11_wtMainContent_wtUserNameInput')
        await page.type('#wt11_wtMainContent_wtUserNameInput', settings.loguin)
        await page.type('#wt11_wtMainContent_wtPasswordInput', settings.password)
        await page.click('#wt11_wtMainContent_wt20')
        await page.waitFor(4000)

        let userInvalid
        try {
            userInvalid = await page.evaluate(() => {
                return document.querySelector('#wt11_WebPatterns_wt4_block_RichWidgets_wt9_block_wtSanitizedHtml2')?.textContent
            })
        } catch (error) {
            userInvalid = undefined
        }

        if (userInvalid) {
            throw 'Usuário ou Senha Inválida'
        }
    } catch (error) {
        if (error === 'Usuário ou Senha Inválida') {
            console.log('[Final-Loguin] - Usuário ou senha inválida')
            settings.messageLogToShowUser = 'Usuário ou senha inválida'
        } else {
            console.log('[Final-Loguin] - Erro ao fazer Loguin')
            settings.messageLogToShowUser = 'Erro ao tentar fazer loguin'
        }
        settings.typeLog = 'error'
        settings.messageLog = 'Loguin'
        settings.messageError = error

        const treatsMessageLog = new TreatsMessageLog(page, settings, browser)
        await treatsMessageLog.saveLog()
    }
}

export default Loguin