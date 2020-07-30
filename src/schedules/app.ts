import express from 'express'

import GetClientLicense from '../controllers/GetClientLicense'
import NFSeGoiania from './jobs/NFSeGoiania'

const app = express()

async function process () {
    const getClientLicense = new GetClientLicense()
    const clientLicense = await getClientLicense.getAccess()

    if (clientLicense.result) {
        NFSeGoiania.start()
    } else {
        console.log('- Cliente sem contrato ativo no momento.')
    }
}

process()

export default app