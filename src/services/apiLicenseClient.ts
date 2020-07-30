import axios from 'axios'
import 'dotenv/config'

const ip = process.env.API_LICENSE_HOST || 'localhost'
const port = Number(process.env.API_LICENSE_PORT) || 3331

const api = axios.create({
    baseURL: `http://${ip}:${port}`
})

export default api