export interface GetFishesMappedByPeriodInterface {
    form: {
        landing: {
            fish: {
                specie_code: number,
                fish_weight: number,
                fish_length: number,
                fish_quantity: number,
                price: number,
                specie:{
                    specie_name: string
                }
            }[]
        }[]
    }[]
    period_date: Date
}
