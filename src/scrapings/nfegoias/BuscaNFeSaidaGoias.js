const path = require('path')
const puppeteer = require('puppeteer-extra')
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
require('dotenv/config')

const MainNFGoias = async () => {
    puppeteer.use(
        RecaptchaPlugin({
            provider: {
                id: '2captcha',
                token: process.env.API_2CAPTCHA
            },
            visualFeedback: true // colorize reCAPTCHAs (violet = detected, green = solved)
        })
    )

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized'],
        executablePath: path.join('C:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe')
    })

    const page = await browser.newPage()

    await page.setViewport({ width: 0, height: 0 })

    await page.goto('https://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal', { ignoreSSL: true })

    await page.waitFor(3000)

    await page.click("a[href*='nfe.sefaz.go.gov'] > button")

    await page.waitFor(3000)

    await page.solveRecaptchas()

    await page.click("button[form='filtro']")

    await page.waitFor(5000)

    await page.click('.btn-download-all')

    await page.waitFor(3000)

    await page.click('#dnwld-all-btn-ok')

    await page.waitFor(3000)

    await browser.close()
}

MainNFGoias()