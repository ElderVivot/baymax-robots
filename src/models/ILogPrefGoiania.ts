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
    messageError?: string,
    urlImageDown: string
}