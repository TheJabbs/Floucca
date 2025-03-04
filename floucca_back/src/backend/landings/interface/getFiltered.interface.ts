export interface GetFilteredInterface {
    form: {
        form_id: number,
        port_id: number
    },
    fish: {
        specie_code: number,
        fish_weight: number,
        fish_quantity: number,
        fish_length: number,
        price: number
    }[]

}