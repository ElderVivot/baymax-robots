import express from 'express'

import NFSeGoiania from './jobs/NFSeGoiania'

const app = express()

NFSeGoiania.start()

const port = 3331
app.listen(port, () => console.log(`Executing Server Schedule in port ${port} !`))