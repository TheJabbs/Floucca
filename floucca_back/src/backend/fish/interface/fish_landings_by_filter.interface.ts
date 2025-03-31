export interface fishLandingsByFilterInterface {
    fish: {
        specie: { specie_name: string }
        specie_code: number
        fish_weight: number
        fish_length: number
        fish_quantity: number
        price: number,
        gear_code: number
    }[]
    form: {
        form_id: number,
        port_id: number
    }
}