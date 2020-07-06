import TTypeLog from './TTypeLog'

export default interface ISettingsGoiania {
    dateHourProcessing: string,
    hourLog: string,
    // companies: Array,
    loguin: string,
    idUser: number,
    password: string,
    typeLog?: TTypeLog,
    companie?: string,
    inscricaoMunicipal?: string,
    codeCompanie?: string,
    year?: string,
    month?: string
}