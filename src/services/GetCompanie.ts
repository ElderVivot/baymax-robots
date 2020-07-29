import GetCompanies from '../controllers/GetCompanies'
import ICompanies from '../models/ICompanies'

export default class GetCompanie {
    private readonly onlyActive: boolean
    private readonly filter: string

    constructor (filter: string, onlyActive: boolean) {
        this.filter = filter
        this.onlyActive = onlyActive
    }

    async checkIfActive (): Promise<Boolean> {
        return true
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

    async getCompanie (): Promise<ICompanies> {
        const getCompanies = new GetCompanies()
        const companies = await getCompanies.getCompanies(this.filter)
        return companies[0]
    }
}

// const getCompanie = new GetCompanie('?code=0', false)
// getCompanie.getCompanie().then(result => console.log(result))