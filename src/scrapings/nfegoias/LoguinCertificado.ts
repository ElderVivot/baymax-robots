import fs from 'fs'
import { Page } from 'puppeteer'
import request from 'request'

// regedit AutoSelectCertificate - {"pattern":"https://nfe.sefaz.go.gov.br","filter":{"SUBJECT":{"CN":"AGF COMERCIO DE BRINQUEDOS LTDA:18122845000115","OU":"Certificado PJ A1"}}}

const pfx = fs.readFileSync('C:/_temp/certificados/alr_eletrica.pfx')
const password = '1062reis'

// function interceptRequest (interceptedRequest) {
//     const options = {
//         uri: interceptedRequest.url(),
//         method: interceptedRequest.method(),
//         headers: interceptedRequest.headers(),
//         body: interceptedRequest.postData(),
//         rejectUnauthorized: true,
//         // strictSSL: true,
//         gzip: true,
//         language: 'pt-BR',
//         agentOptions: {
//             pfx: pfx,
//             passphrase: password
//             // securityOptions: 'SSL_OP_NO_SSLv3'
//         }
//     }
//     console.log('processando')

//     request(options, async function (err, resp, body) {
//         if (err) {
//             return interceptedRequest.abort('connectionrefused')
//         }

//         if (interceptedRequest.url().endsWith('.ico')) {
//             return
//         }

//         cookies = resp.headers['set-cookie']
//         console.log(cookies)
//         if (cookies) {
//             if (cookies[0].indexOf('JSESSIONID') >= 0) {
//                 await page.setCookie(...await page.cookies(), {
//                     name: 'JSESSIONID',
//                     value: cookies[0].split(';')[0].split('=')[1],
//                     secure: false
//                 })
//             }
//         }

//         return interceptedRequest.respond({
//             status: resp.statusCode,
//             contentType: resp.headers['content-type'],
//             headers: interceptedRequest.headers(),
//             body: body
//         })
//     })
// }

const LoguinCertificado = async (page: Page): Promise<void> => {
    await page.setRequestInterception(true)

    page.on('request', interceptedRequest => {
        const options = {
            uri: interceptedRequest.url(),
            method: interceptedRequest.method(),
            headers: interceptedRequest.headers(),
            body: interceptedRequest.postData(),
            rejectUnauthorized: true,
            // strictSSL: true,
            gzip: true,
            language: 'pt-BR',
            agentOptions: {
                pfx: pfx,
                passphrase: password
                // securityOptions: 'SSL_OP_NO_SSLv3'
            }
        }
        console.log('processando')

        request(options, async function (err, resp, body) {
            if (err) {
                return interceptedRequest.abort('connectionrefused')
            }

            if (interceptedRequest.url().endsWith('.ico')) {
                return
            }

            const cookies = resp.headers['set-cookie']
            if (cookies) {
                if (cookies[0].indexOf('JSESSIONID') >= 0) {
                    const dataCookie = {
                        name: 'JSESSIONID',
                        value: cookies[0].split(';')[0].split('=')[1],
                        secure: false
                    }
                    console.log(dataCookie)
                    await page.setCookie(...await page.cookies(), dataCookie)
                }
            }

            return interceptedRequest.respond({
                status: resp.statusCode,
                contentType: resp.headers['content-type'],
                headers: interceptedRequest.headers(),
                body: body
            })
        })
    })

    await page.goto('https://nfe.sefaz.go.gov.br/nfeweb/sites/nfe/consulta-publica/principal')

    await page.waitFor(3000)

    await page.click("a[href*='nfe.sefaz.go.gov'] > button")
    // await page.keyboard.press('enter')

    await page.waitFor('#filtro', { timeout: 100000 })

    console.log('chegueiiiiiiiii')
    // page.removeListener('request', interceptRequest)
    // await page.setRequestInterception(false)
}

export default LoguinCertificado