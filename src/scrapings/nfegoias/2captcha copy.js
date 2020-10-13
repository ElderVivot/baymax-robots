const poll = require('promise-poller').default
const request = require('request-promise-native')
require('dotenv/config')

// interface ISiteDetails {
//     sitekey: string,
//     pageurl: string
// }

async function initiateCaptchaRequest (siteDetails) {
    const formData = {
        method: 'userrecaptcha',
        googlekey: siteDetails.sitekey,
        key: process.env.API_2CAPTCHA,
        pageurl: siteDetails.pageurl,
        json: 1
    }
    const response = await request.post('http://2captcha.com/in.php', { form: formData })
    return JSON.parse(response).request
}

async function pollForRequestResults (id, retries = 30, interval = 1500, delay = 15000) {
    await timeout(delay)
    return poll({
        taskFn: requestCaptchaResults(id),
        interval,
        retries,
        progressCallback: (retriesRemaining, error) => console.log(retriesRemaining, error)
    })
}

function requestCaptchaResults (requestId) {
    const url = `http://2captcha.com/res.php?key=${process.env.API_2CAPTCHA}&action=get&id=${requestId}&json=1`
    return async function () {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async function (resolve, reject) {
            const rawResponse = await request.get(url)
            const resp = JSON.parse(rawResponse)
            if (resp.status === 0) return reject(resp.request)
            resolve(resp.request)
        })
    }
}

const timeout = millis => new Promise(resolve => setTimeout(resolve, millis))

module.exports = { initiateCaptchaRequest, pollForRequestResults, requestCaptchaResults, timeout }