export default class NFSeGoiania {
    numero: number
    codigoVerificacao: string
    valorServicos: number

    process () {
        this.numero = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'Numero', 0])
        keyNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'CodigoVerificacao', 0])
    }

    const

            const keyNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'CodigoVerificacao', 0])
            const nameFileToSave = `${numberNF}_${keyNF}`

    // const issueDateNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DataEmissao', 0])

    // const valueNF = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DeclaracaoPrestacaoServico', 0, 'InfDeclaracaoPrestacaoServico', 0, 'Servico', 0, 'Valores', 0, 'ValorServicos', 0])

    // const cnpjReceiver = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DeclaracaoPrestacaoServico', 0, 'InfDeclaracaoPrestacaoServico', 0, 'Tomador', 0, 'IdentificacaoTomador', 0, 'CpfCnpj', 0, 'Cnpj', 0])
    // const cpfReceiver = returnDataInDictOrArray(nf, ['ListaNfse', 0, 'CompNfse', 0, 'Nfse', 0, 'InfNfse', 0, 'DeclaracaoPrestacaoServico', 0, 'InfDeclaracaoPrestacaoServico', 0, 'Tomador', 0, 'IdentificacaoTomador', 0, 'CpfCnpj', 0, 'Cpf', 0])
    // const cgceReceiver = !cnpjReceiver ? cpfReceiver : cnpjReceiver
}