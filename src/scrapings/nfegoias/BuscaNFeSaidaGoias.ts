import path from 'path'
import puppeteer from 'puppeteer-core'

import { initiateCaptchaRequest, pollForRequestResults } from './2captcha'
import LoguinCertificado from './LoguinCertificado'

const siteDetails = {
    sitekey: '6LfTFzIUAAAAAKINyrQ9X5LPg4W3iTbyyYKzeUd3',
    pageurl: 'https://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal'
}

const MainNFGoias = async () => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: false,
        args: ['--start-maximized'],
        devtools: true,
        executablePath: path.join('C:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe')
    })

    const page = await browser.newPage()

    await page.setViewport({ width: 0, height: 0 })

    await page.setJavaScriptEnabled(true)

    await LoguinCertificado(page)

    const requestId = await initiateCaptchaRequest(siteDetails)

    const response = await pollForRequestResults(requestId)

    await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`)

    await Promise.all([
        page.waitForNavigation(),
        page.click("button[form='filtro']")
    ])

    // await page.setCookie(c)

    await page.click('.btn-download-all')

    await page.waitFor(3000)

    await page.click('#dnwld-all-btn-ok')

    await page.waitFor(100000)

    // await browser.close()
}

MainNFGoias()