import TTypeLog from './TTypeLog'

export default interface ISettingsGoiania {
    dateHourProcessing: string,
    hourLog: string,
    loguin: string,
    idUser: number,
    password: string,
    typeLog?: TTypeLog,
    codeCompanie?: string,
    companie?: string,
    cgceCompanie?: string,
    inscricaoMunicipal?: string,
    year?: string,
    month?: string,
    messageError?: string
    messageLog?: string
    error?: string,
    valueLabelSite?: string
}