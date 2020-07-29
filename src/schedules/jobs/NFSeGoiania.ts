import { CronJob } from 'cron'

import NFSeGoiania from '../../scrapings/nfsegoiania/index'

async function processNotes () {
    const applicattion = new NFSeGoiania()
    applicattion.process()
}

const job = new CronJob(
    '00 19 * * *',
    async function () {
        await processNotes()
    },
    null,
    true,
    'America/Sao_Paulo'
)

export default job