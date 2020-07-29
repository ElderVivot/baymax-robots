import fs from 'fs'
import path from 'path'
import { Parser, Builder } from 'xml2js'

import SaveLogPrefGoiania from '../../controllers/SaveLogPrefGoiania'
import SaveNotesNfse from '../../controllers/SaveNotesNfse'
import ISettingsGoiania from '../../models/ISettingsGoiania'
import NFSeGoiania from '../../services/read_xmls/NFSeGoiania'
import createFolderToSaveData from '../../utils/CreateFolderToSaveData'
import { returnDataInDictOrArray } from '../../utils/functions'

const parser = new Parser()
const builder = new Builder()

const SaveXMLsGoiania = {
    key: 'SaveXMLsGoiania',
    async handle ({ data }): Promise<void> {
        const settings: ISettingsGoiania = data.settings
        const dataXml: string = data.dataXml

        console.log('---------------------------------------------------')
        console.log(`- [XMLsGoiania] - Iniciando processamento ${settings.companie} comp. ${settings.month}-${settings.year}`)

        let pathNote = await createFolderToSaveData(settings)
        const pathOriginal = pathNote

        let pathNoteRoutineAutomactic = await createFolderToSaveData(settings, true)
        const pathOriginalRoutineAutomactic = pathNoteRoutineAutomactic

        let existError = false

        const noteJson = await parser.parseStringPromise(dataXml)

        const nfsXml = returnDataInDictOrArray(noteJson, ['geral', 'GerarNfseResposta'])

        const qtdNfs = Number(nfsXml.length)
        for (let i = 0; i < qtdNfs; i++) {
            const nf = nfsXml[i]
            console.log(`\t- Processando nota ${i + 1} de ${qtdNfs}`)
            const nfToXml = {
                GerarNfseResposta: nf
            }

            try {
                const nfseGoiania = NFSeGoiania(nf)

                const saveNotesNfse = new SaveNotesNfse()
                await saveNotesNfse.save({
                    codeCompanie: settings.codeCompanie,
                    nameCompanie: settings.companie,
                    cgceCompanie: nfseGoiania.cgcePrestador,
                    inscricaoMunicipalCompanie: settings.inscricaoMunicipal,
                    numberNote: nfseGoiania.numero,
                    keyNote: nfseGoiania.codigoVerificacao,
                    dateNote: nfseGoiania.dataEmissao,
                    nameTomador: nfseGoiania.nameTomador,
                    cgceTomador: nfseGoiania.cgceTomador,
                    statusNote: nfseGoiania.statusNota,
                    amountNote: nfseGoiania.valorServicos,
                    amountCalculationBase: nfseGoiania.baseCalculo,
                    rateISS: nfseGoiania.aliquotaIss,
                    amountISS: nfseGoiania.valorIss,
                    amountCSLL: nfseGoiania.valorCsll,
                    amountINSS: nfseGoiania.valorInss,
                    amountIRRF: nfseGoiania.valorIr,
                    amountPIS: nfseGoiania.valorPis,
                    amountCOFINS: nfseGoiania.valorCofins
                })

                const nameFileToSave = `${nfseGoiania.numero}-${nfseGoiania.codigoVerificacao}`

                pathNote = path.join(pathOriginal, `${nameFileToSave}.xml`)
                pathNoteRoutineAutomactic = path.join(pathOriginalRoutineAutomactic, `${nameFileToSave}.xml`)

                const xml = builder.buildObject(nfToXml)
                fs.writeFileSync(pathNote, xml)
                if (settings.codeCompanie && pathOriginalRoutineAutomactic) {
                    console.log(settings.codeCompanie)
                    fs.writeFileSync(pathNoteRoutineAutomactic, xml)
                }
            } catch (error) {
                existError = true
            }
        }

        if (!existError) {
            const saveLogPrefGoiania = new SaveLogPrefGoiania()
            await saveLogPrefGoiania.saveLog({
                prefGoianiaAccess: settings.idUser,
                hourLog: settings.hourLog,
                typeLog: 'success',
                messageLog: 'SucessToSaveNotes',
                messageLogToShowUser: 'Notas salvas com sucesso',
                messageError: '',
                urlImageDown: '',
                codeCompanie: settings.codeCompanie,
                nameCompanie: settings.companie,
                inscricaoMunicipal: settings.inscricaoMunicipal,
                dateStartDown: settings.dateStartDown,
                dateEndDown: settings.dateEndDown,
                qtdNotesDown: qtdNfs
            })
        }
    }
}

// SaveXMLsGoiania.handle('<geral><GerarNfseResposta xmlns="http://nfse.goiania.go.gov.br/xsd/nfse_gyn_v02.xsd"><ListaNfse><CompNfse><Nfse versao="2.00"><InfNfse><Numero>1695</Numero><CodigoVerificacao>VHKF-KBWM</CodigoVerificacao><DataEmissao>2020-07-03T00:00:00</DataEmissao><ValoresNfse><BaseCalculo>446.1</BaseCalculo><Aliquota>5</Aliquota><ValorIss>22.30</ValorIss></ValoresNfse><DeclaracaoPrestacaoServico><InfDeclaracaoPrestacaoServico><Rps><IdentificacaoRps><Numero>930</Numero><Serie>UNICA</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2020-07-03T00:00:00</DataEmissao><Status>1</Status></Rps><Competencia>2020-07-03T00:00:00</Competencia><Servico><Valores><ValorServicos>446.1</ValorServicos><ValorDeducoes>0</ValorDeducoes><ValorPis>0</ValorPis><ValorCofins>0</ValorCofins><ValorInss>0</ValorInss><ValorIr>0</ValorIr><ValorCsll>0</ValorCsll><ValorIss>22.30</ValorIss><Aliquota>5</Aliquota><DescontoIncondicionado>0</DescontoIncondicionado></Valores><IssRetido>2</IssRetido><CodigoTributacaoMunicipio>692060100</CodigoTributacaoMunicipio><Discriminacao>PRESTACAO SERVICOS CONTABEIS - Valor total do servico: 446,10, Valor Liquido 446,10</Discriminacao><CodigoMunicipio>0025300</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>0025300</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>25522091000156</Cnpj></CpfCnpj><InscricaoMunicipal>4273222</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cnpj>02747289000132</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>CONCREJACTO REPRESENTACOES UNIPESSOAL LTDA</RazaoSocial><Endereco><Endereco>C 205</Endereco><Numero>645</Numero><Complemento>QD 478 LT 06 SL 01</Complemento><Bairro>JARDIM AMERICA</Bairro><CodigoMunicipio>0025300</CodigoMunicipio><Cep>74270020</Cep></Endereco></Tomador><OptanteSimplesNacional>2</OptanteSimplesNacional></InfDeclaracaoPrestacaoServico></DeclaracaoPrestacaoServico></InfNfse></Nfse></CompNfse></ListaNfse><ListaMensagemRetorno><MensagemRetorno><Codigo>L000</Codigo><Mensagem>NORMAL</Mensagem></MensagemRetorno></ListaMensagemRetorno></GerarNfseResposta><GerarNfseResposta xmlns="http://nfse.goiania.go.gov.br/xsd/nfse_gyn_v02.xsd"><ListaNfse><CompNfse><Nfse versao="2.00"><InfNfse><Numero>1696</Numero><CodigoVerificacao>CEAZ-FEM8</CodigoVerificacao><DataEmissao>2020-07-08T00:00:00</DataEmissao><ValoresNfse><BaseCalculo>3117</BaseCalculo><Aliquota>5</Aliquota><ValorIss>155.85</ValorIss></ValoresNfse><DeclaracaoPrestacaoServico><InfDeclaracaoPrestacaoServico><Rps><IdentificacaoRps><Numero>931</Numero><Serie>UNICA</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2020-07-08T00:00:00</DataEmissao><Status>1</Status></Rps><Competencia>2020-07-08T00:00:00</Competencia><Servico><Valores><ValorServicos>3117</ValorServicos><ValorDeducoes>0</ValorDeducoes><ValorPis>0</ValorPis><ValorCofins>0</ValorCofins><ValorInss>0</ValorInss><ValorIr>0</ValorIr><ValorCsll>0</ValorCsll><ValorIss>155.85</ValorIss><Aliquota>5</Aliquota><DescontoIncondicionado>0</DescontoIncondicionado></Valores><IssRetido>2</IssRetido><CodigoTributacaoMunicipio>692060100</CodigoTributacaoMunicipio><Discriminacao>PRESTACAO SERVICOS CONTABEIS - Valor total do servico: 3.117,00, Valor Liquido3.117,00</Discriminacao><CodigoMunicipio>0025300</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>0025300</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>25522091000156</Cnpj></CpfCnpj><InscricaoMunicipal>4273222</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cnpj>83322784000100</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>AUTO POSTO POPULAR LTDA</RazaoSocial><Endereco><Endereco>RAIMUNDO VERIDIANO CARDOSO</Endereco><Numero>416</Numero><Complemento></Complemento><Bairro>SANTA MONICA</Bairro><CodigoMunicipio>0103000</CodigoMunicipio><Cep>68456760</Cep></Endereco></Tomador><OptanteSimplesNacional>2</OptanteSimplesNacional></InfDeclaracaoPrestacaoServico></DeclaracaoPrestacaoServico></InfNfse></Nfse></CompNfse></ListaNfse><ListaMensagemRetorno><MensagemRetorno><Codigo>L000</Codigo><Mensagem>NORMAL</Mensagem></MensagemRetorno></ListaMensagemRetorno></GerarNfseResposta></geral>')
// SaveXMLsGoiania.handle({
//     dataXml: '<geral><GerarNfseResposta xmlns="http://nfse.goiania.go.gov.br/xsd/nfse_gyn_v02.xsd"><ListaNfse><CompNfse><Nfse versao="2.00"><InfNfse><Numero>1696</Numero><CodigoVerificacao>CEAZ-FEM8</CodigoVerificacao><DataEmissao>2020-07-08T00:00:00</DataEmissao><ValoresNfse><BaseCalculo>3117</BaseCalculo><Aliquota>5</Aliquota><ValorIss>155.85</ValorIss></ValoresNfse><DeclaracaoPrestacaoServico><InfDeclaracaoPrestacaoServico><Rps><IdentificacaoRps><Numero>931</Numero><Serie>UNICA</Serie><Tipo>1</Tipo></IdentificacaoRps><DataEmissao>2020-07-08T00:00:00</DataEmissao><Status>1</Status></Rps><Competencia>2020-07-08T00:00:00</Competencia><Servico><Valores><ValorServicos>3117</ValorServicos><ValorDeducoes>0</ValorDeducoes><ValorPis>0</ValorPis><ValorCofins>0</ValorCofins><ValorInss>0</ValorInss><ValorIr>0</ValorIr><ValorCsll>0</ValorCsll><ValorIss>155.85</ValorIss><Aliquota>5</Aliquota><DescontoIncondicionado>0</DescontoIncondicionado></Valores><IssRetido>2</IssRetido><CodigoTributacaoMunicipio>692060100</CodigoTributacaoMunicipio><Discriminacao>PRESTACAO SERVICOS CONTABEIS - Valor total do servico: 3.117,00, Valor Liquido3.117,00</Discriminacao><CodigoMunicipio>0025300</CodigoMunicipio><ExigibilidadeISS>1</ExigibilidadeISS><MunicipioIncidencia>0025300</MunicipioIncidencia></Servico><Prestador><CpfCnpj><Cnpj>25522091000156</Cnpj></CpfCnpj><InscricaoMunicipal>4273222</InscricaoMunicipal></Prestador><Tomador><IdentificacaoTomador><CpfCnpj><Cnpj>83322784000100</Cnpj></CpfCnpj></IdentificacaoTomador><RazaoSocial>AUTO POSTO POPULAR LTDA</RazaoSocial><Endereco><Endereco>RAIMUNDO VERIDIANO CARDOSO</Endereco><Numero>416</Numero><Complemento></Complemento><Bairro>SANTA MONICA</Bairro><CodigoMunicipio>0103000</CodigoMunicipio><Cep>68456760</Cep></Endereco></Tomador><OptanteSimplesNacional>2</OptanteSimplesNacional></InfDeclaracaoPrestacaoServico></DeclaracaoPrestacaoServico></InfNfse></Nfse></CompNfse></ListaNfse><ListaMensagemRetorno><MensagemRetorno><Codigo>L000</Codigo><Mensagem>NORMAL</Mensagem></MensagemRetorno></ListaMensagemRetorno></GerarNfseResposta></geral>',
//     settings: ''
// })

// const test = { a: { b: 'teste ' } }
// console.log(xmljs.json2xml(`'${JSON.stringify(test)}'`))
// console.log(`'${JSON.stringify(test)}'`)

export default SaveXMLsGoiania