import TTypeLog from './TTypeLog'

export default interface ILogPrefGoiania {
    prefGoianiaAccess: number,
    inscricaoMunicipal?: string,
    nameCompanie?: string,
    codeCompanie?: string,
    hourLog: string,
    dateStartDown?: string,
    dateEndDown?: string,
    typeLog: TTypeLog,
    messageLog: string,
    messageLogToShowUser: string,
    messageError?: string,
    urlImageDown?: string,
    qtdNotesDown?: number
}