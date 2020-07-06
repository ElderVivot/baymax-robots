import api from '../services/api'

export default class GetPrefGoianiaAccess {
    async getSettings (): Promise<any> {
        try {
            let accessResult = ''
            const access = await api.get('/settings_down_notes')
            if (access.status === 200) {
                accessResult = access.data
            }
            console.log(`- [controllers_GetSettingsDownNotes] --> Success --> ${1} length`)
            return accessResult
        } catch (error) {
            console.log(`- [controllers_GetSettingsDownNotes] --> Error --> ${error}`)
            return ''
        }
    }
}

// const getPrefGoianiaAccess = new GetPrefGoianiaAccess()
// getPrefGoianiaAccess.getAccess().then(result => console.log(result))