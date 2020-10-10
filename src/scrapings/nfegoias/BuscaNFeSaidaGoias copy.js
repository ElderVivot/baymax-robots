// import fs from 'fs'
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer-extra')
const request = require('request')

const { initiateCaptchaRequest, pollForRequestResults } = require('./2captcha')

const siteDetails = {
    sitekey: '6LfTFzIUAAAAAKINyrQ9X5LPg4W3iTbyyYKzeUd3',
    pageurl: 'https://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal'
}

const MainNFGoias = async () => {
    const browser = await puppeteer.launch({
        ignoreHTTPSErrors: true,
        headless: false,
        args: ['--start-maximized'],
        executablePath: path.join('C:', 'Program Files (x86)', 'Google', 'Chrome', 'Application', 'chrome.exe')
    })

    const page = await browser.newPage()

    await page.setViewport({ width: 0, height: 0 })

    // const pfx = fs.readFileSync('C:/_temp/certificados/alr_eletrica.pfx')
    // const password = '1062reis'

    await page.goto('https://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal', { timeout: 100000 })

    await page.waitFor(3000)

    await page.setRequestInterception(true)
    page.on('request', interceptedRequest => {
        const options = {
            uri: interceptedRequest.url(),
            method: interceptedRequest.method(),
            headers: interceptedRequest.headers(),
            body: interceptedRequest.postData(),
            // rejectUnauthorized: false,
            // strictSSL: true,
            gzip: true,
            agentOptions: {
                pfx: pfx,
                passphrase: password,
                securityOptions: 'SSL_OP_NO_SSLv3'
            }
        }

        request(options, function (err, resp, body) {
            console.log(err)
            if (interceptedRequest.url().endsWith('.ico')) {
                return
            }
            cookies = resp.headers['set-cookie']
            console.log(cookies)
            if (cookies) {
                if (cookies[0].indexOf('JSESSIONID') >= 0) {
                    await page.setCookie(...await page.cookies(), {
                        name: 'JSESSIONID',
                        value: cookies[0].split(';')[0].split('=')[1],
                        secure: false
                    })
                }
            }

            return interceptedRequest.respond({
                status: resp.statusCode,
                contentType: resp.headers['content-type'],
                headers: resp.headers,
                body: body
            })
        })
    })

    await page.click("a[href*='nfe.sefaz.go.gov'] > button")

    await page.waitFor(3000)

    const requestId = await initiateCaptchaRequest(siteDetails)

    const response = await pollForRequestResults(requestId)

    await page.evaluate(`document.getElementById("g-recaptcha-response").innerHTML="${response}";`)

    await Promise.all([
        page.waitForNavigation(),
        page.click("button[form='filtro']")
    ])

    await page.click('.btn-download-all')

    await page.waitFor(3000)

    await page.click('#dnwld-all-btn-ok')

    await page.waitFor(100000)

    await browser.close()
}

MainNFGoias()