import { format } from 'date-fns-tz'

import GetPrefGoianiaAccess from '../../controllers/GetPrefGoianiaAccess'
import MainNfseGoiania from './MainNfseGoiania'

class Applicattion {
    private hourLog: string
    private hourLogToCreateFolder: string

    constructor () {
        this.hourLogToCreateFolder = format(new Date(), 'yyyy-MM-dd_hh-mm-ss_a', { timeZone: 'America/Sao_Paulo' })
        this.hourLog = format(new Date(), 'yyyy-MM-dd hh:mm:ss a', { timeZone: 'America/Sao_Paulo' })
    }

    async process () {
        const getPrefGoianiaAccess = new GetPrefGoianiaAccess()
        const allAccess = await getPrefGoianiaAccess.getAccess()
        for (const access of allAccess) {
            const settings = {
                dateHourProcessing: this.hourLogToCreateFolder,
                hourLog: this.hourLog,
                loguin: access.user,
                password: access.password,
                idUser: access.id
            }
            await MainNfseGoiania(settings)
        }
    }
}

const applicattion = new Applicattion()
applicattion.process()