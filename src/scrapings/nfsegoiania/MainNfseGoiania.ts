import puppeteer from 'puppeteer'

import ISettingsGoiania from '../../models/ISettingsGoiania'
import GetCompanie from '../../services/GetCompanie'
import AlertSimplesNacional from './AlertSimplesNacional'
import CheckIfAvisoFrameMnuAfterEntrar from './CheckIfAvisoFrameMnuAfterEntrar'
import CheckIfEmpresaEstaBaixada from './CheckIfEmpresaEstaBaixada'
import CheckIfExistNoteInPeriod from './CheckIfExistNoteInPeriod'
import CheckIfSelectLoaded from './CheckIfSelectLoaded'
import ClickDownloadXML from './ClickDownloadXML'
import ClickListarXML from './ClickListarXML'
import ClickNFeEletronica from './ClickNFeEletronica'
import ClickPortalContribuinte from './ClickPortalContribuinte'
import ClickToOpenContentXML from './ClickToOpenContentXML'
import CloseOnePage from './CloseOnePage'
import GetCNPJPrestador from './GetCNPJPrestador'
import GetContentXML from './GetContentXML'
import GetOptionsEmpresas from './GetOptionsEmpresas'
import GotoLinkNFeEletrotinaEntrar from './GotoLinkNFeEletrotinaEntrar'
import Loguin from './Loguin'
import OpenSiteGoiania from './OpenSiteGoiania'
import SaveXML from './SaveXML'
import SelectPeriodToDownload from './SelectPeriodToDownload'

const MainNfseGoiania = async (settings: ISettingsGoiania): Promise<void> => {
    const { loguin, password } = settings

    try {
        console.log(`[0] - Abrindo loguin ${loguin}`)

        const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'] })
        const page = await browser.newPage()
        await page.setViewport({ width: 1366, height: 768 })

        // 1 - Acessa página de Goiânia
        console.log('[1] - Abrindo site da prefeitura')
        await OpenSiteGoiania(page, browser, settings)

        // 2 - Faz loguin
        console.log('[2] - Realizando o loguin')
        await Loguin(page, browser, settings)

        // 3 - Clica no botão portal do contribuinte
        console.log('[3] - Clicando no botão "Portal Contruinte"')
        await ClickPortalContribuinte(page, browser, settings)

        // 4 - Seleciona as empresas que a pessoa tem acesso
        console.log('[4] - Pegando a relação de empresas que este contribuinte possui.')
        const optionsEmpresas = await GetOptionsEmpresas(page, browser, settings)

        // 5 - pega a URL atual pra não ter que abrir do zero o processo
        const urlActual = page.url()

        // 6 - Percorre o array de empresas
        for (const option of optionsEmpresas) {
            console.log(`\t[5] - Iniciando processamento da empresa ${option.label} - ${option.inscricaoMunicipal}`)

            // settings.valueEmpresa = option.value
            settings.companie = option.label
            settings.inscricaoMunicipal = option.inscricaoMunicipal

            const getCompanie = new GetCompanie(`?inscricaoMunicipal=${option.inscricaoMunicipal}`, false)
            const companie = await getCompanie.getCompanie()
            settings.codeCompanie = companie ? companie.code : ''

            try {
                // 7 - Abre uma nova aba no navegador e navega pra página atual
                const pageEmpresa = await browser.newPage()
                await pageEmpresa.setViewport({ width: 0, height: 0 })
                await pageEmpresa.goto(urlActual)

                // 8 - Seleciona a empresa
                console.log('\t[6] - Realizando a troca pra empresa atual')
                await pageEmpresa.waitFor('#GoianiaTheme_wtTelaPrincipal_block_wtActions_SISEGIntegration_wt104_block_wtAcessos')
                await pageEmpresa.select('#GoianiaTheme_wtTelaPrincipal_block_wtActions_SISEGIntegration_wt104_block_wtAcessos', option.value)

                // 9 - Aguardando troca
                console.log('\t[7] - Checando se a troca foi realizada com sucesso')
                await CheckIfSelectLoaded(pageEmpresa, settings)

                // 10 - Verificando se o "Contribuinte está com a situação Baixa"
                console.log('\t[8] - Verificando se o "Contribuinte está com a situação Baixada/Suspensa"')
                await CheckIfEmpresaEstaBaixada(pageEmpresa, settings)

                // 11 - Clicando no botão NF-e Eletrônica
                console.log('\t[9] - Clicando no botão "NF-e Eletrônica"')
                await ClickNFeEletronica(pageEmpresa, settings)

                // 12 - Abre o link do botão "Entrar"
                console.log('\t[10] - Clicando no botão "Entrar"')
                await GotoLinkNFeEletrotinaEntrar(pageEmpresa, settings)

                // 13 - Aviso depois do botão "Entrar" --> caso tenha aviso para o processamento desta
                // empresa, pois geralmente quando tem é empresa sem atividade de serviço ou usuário inválido
                await CheckIfAvisoFrameMnuAfterEntrar(pageEmpresa, settings)

                //         // 14 - Passa pelo Alerta do Simples Nacional
                //         console.log('\t[11] - Passando pelo alerta do simples nacional.')
                //         await AlertSimplesNacional(pageEmpresa, settings)

                //         // 15 - Clica no botão "Download de XML de Notas Fiscais por período"
                //         console.log('\t[12] - Clicando no botão "Download de XML de Notas Fiscais por período"')
                //         await ClickDownloadXML(pageEmpresa, settings)

                //         // 16 - Analisa se o CNPJ é de cliente válido
                //         console.log('\t[13] - Analisando se o CNPJ/CPF do Prestador é cliente desta Contabilidade')
                //         const cpfCnpj = await GetCNPJPrestador(pageEmpresa, settings)

                //         settings.cpfCnpj = cpfCnpj

                //         // 17 - Seleciona o Período pra download
                //         console.log('\t[14] - Seleciona o período desejado pra baixar os XMLs')
                //         await SelectPeriodToDownload(pageEmpresa, settings)

                //         // 18 - Clica no botão "Listar"
                //         console.log('\t[15] - Clicando no botão "Listar"')
                //         const newPagePromise = new Promise(resolve => {
                //             browser.once('targetcreated', target => resolve(target.page()))
                //         })
                //         await ClickListarXML(pageEmpresa, newPagePromise, settings)

                //         // 19 - Verifica se tem notas no período solicitado, caso não, para o processamento
                //         await CheckIfExistNoteInPeriod(pageEmpresa, settings)

                //         // 20 - Abre o conteúdo do XML
                //         console.log('\t[16] - Abrindo os dados das notas')
                //         await ClickToOpenContentXML(pageEmpresa, settings)

                //         // 21 - Pega conteúdo do XML
                //         console.log('\t[17] - Obtendo conteúdo das notas')
                //         const contentXML = await GetContentXML(pageEmpresa, settings)

                //         // 22 - Salva o XML
                //         console.log('\t[18] - Salvando XML das notas')
                //         await SaveXML(contentXML, settings)

                // Fecha a aba da empresa afim de que possa abrir outra
                await CloseOnePage(pageEmpresa)
            } catch (error) {
                console.log(error)
            }
        }

        console.log('[Final-Loguin] - Todos os dados deste loguin processados, fechando navegador.')
        await page.waitFor(3000)
        await browser.close()
    } catch (error) {
        console.log(error)
    }
}

export default MainNfseGoiania