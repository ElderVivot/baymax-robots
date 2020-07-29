import ISettingsGoiania from '../../models/ISettingsGoiania'
import Queue from '../../queues/lib/Queue'

const SendXMLToQueues = async (settings: ISettingsGoiania, content: string): Promise<void> => {
    settings.typeLog = 'success'
    await Queue.add({
        dataXml: `<geral>${content}</geral>`,
        settings
    })
}

export default SendXMLToQueues