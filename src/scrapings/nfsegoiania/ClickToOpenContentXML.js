const path = require('path')
const createFolderToSaveData = require('../../utils/CreateFolderToSaveData')

const ClickToOpenContentXML = async(page, settingsProcessing) => {
    try {
        await page.waitFor('a[href]')
        await Promise.all([
            page.click('a[href]'),
            page.waitForNavigation({waitUntil: 'load', timeout: 1200000}) // aguarda até 20 minutos carregar a página pra fazer o download
        ])
    } catch (error) {
        console.log('\t[Final-Empresa] - Erro ao abrir o conteúdo do XML')
        console.log('\t-------------------------------------------------')
        const settings = { ...settingsProcessing, type: 'error' }
        let pathImg = createFolderToSaveData(settings)
        pathImg = path.join(pathImg, 'ClickToOpenContentXML.png')
        await page.screenshot( { path: pathImg } )
        await page.close()
        throw 'Error-ClickToOpenContentXML'
    }
}

module.exports = ClickToOpenContentXML