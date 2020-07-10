import { CronJob } from 'cron'

import NFSeGoiania from '../../scrapings/nfsegoiania/index'

async function processNotes () {
    const applicattion = new NFSeGoiania()
    applicattion.process()
}

const job = new CronJob(
    '22 22 * * *',
    async function () {
        await processNotes()
    },
    null,
    true,
    'America/Sao_Paulo'
)

export default job