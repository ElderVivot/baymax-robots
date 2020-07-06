import api from './api'

export default class GetCompanies {
    async onlyActives (): Promise<Boolean> {
        return false
    }

    async getCompanies () {
        const companies = await api.get('/companies')
        return companies
        // const companies = await getExtractCompanies.getData()
        // for (const companie of companies) {
        //     const cgce_emp = companie.cgce_emp
        //     // ignora as empresas com CNPJ inválido
        //     if (cgce_emp === null || cgce_emp === '' || cgce_emp === '00000000000000') {
        //         continue
        //     }

        //     const stat_emp = companie.stat_emp.toUpperCase()
        //     const dina_emp = companie.dina_emp === null ? null : moment(companie.dina_emp.substring(0, 10))
        //     if (dina_emp !== null) {
        //         if (dina_emp > this.dateFinal) {
        //             this.companies.push(cgce_emp)
        //         }
        //     } else {
        //         if (stat_emp === 'A') {
        //             this.companies.push(cgce_emp)
        //         }
        //     }
        // }
    }
}