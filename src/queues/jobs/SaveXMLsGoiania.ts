import fs from 'fs'
import path from 'path'
import { Parser, Builder } from 'xml2js'

import SaveLogPrefGoiania from '../../controllers/SaveLogPrefGoiania'
import ISettingsGoiania from '../../models/ISettingsGoiania'
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

            const numberNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'Numero', 0])

            const keyNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'CodigoVerificacao', 0])
            const nameFileToSave = `${numberNF}_${keyNF}`

            // const issueDateNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DataEmissao', 0])

            // const valueNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DeclaracaoPrestacaoServico', 0, 'InfDeclaracaoPrestacaoServico', 0, 'Servico', 0, 'Valores', 0, 'ValorServicos', 0])

            // const cnpjReceiver = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DeclaracaoPrestacaoServico', 0, 'InfDeclaracaoPrestacaoServico', 0, 'Tomador', 0, 'IdentificacaoTomador', 0, 'CpfCnpj', 0, 'Cnpj', 0])
            // const cpfReceiver = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DeclaracaoPrestacaoServico', 0, 'InfDeclaracaoPrestacaoServico', 0, 'Tomador', 0, 'IdentificacaoTomador', 0, 'CpfCnpj', 0, 'Cpf', 0])
            // const cgceReceiver = !cnpjReceiver ? cpfReceiver : cnpjReceiver

            pathNote = path.join(pathOriginal, `${nameFileToSave}.xml`)
            pathNoteRoutineAutomactic = path.join(pathOriginalRoutineAutomactic, `${nameFileToSave}.xml`)

            try {
                fs.writeFileSync(pathNote, builder.buildObject(nfToXml))
                if (settings.companie && pathOriginalRoutineAutomactic) {
                    fs.writeFileSync(pathNoteRoutineAutomactic, builder.buildObject(nfToXml))
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
                messageError: settings.messageError,
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