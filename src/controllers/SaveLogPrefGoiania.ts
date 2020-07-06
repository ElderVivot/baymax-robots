import ILogPrefGoiania from '../models/ILogPrefGoiania'
import api from '../services/api'

export default class SaveLogPrefGoiania {
    async saveLog (logPrefGoiania: ILogPrefGoiania): Promise<any> {
        console.log(logPrefGoiania)
        try {
            const result = await api.post('/log_pref_goiania', { ...logPrefGoiania })
            if (result.status === 200) {
                console.log(`- [controllers_SaveLogPrefGoiania] --> Success --> ${1}`)
                return result
            }
        } catch (error) {
            console.log(`- [controllers_SaveLogPrefGoiania] --> Error --> ${error}`)
        }
    }
}