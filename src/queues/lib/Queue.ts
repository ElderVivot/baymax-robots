import Queue from 'bull'

import redisConfig from '../../config/redis'
import SaveXMLsGoiania from '../jobs/SaveXMLsGoiania'

const saveXMLsGoiania = new Queue(SaveXMLsGoiania.key, { redis: redisConfig })

saveXMLsGoiania.on('failed', (job, error) => {
    console.log('Job failed')
    console.log(error)
})

// saveXMLsGoiania.on('completed', (job) => {
//     console.log('Job completed', job.id, job.queue)
// })

export default saveXMLsGoiania