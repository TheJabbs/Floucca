export interface GetFilteredInterface{
        form_id : number,
        port_id: number,
        fish:{
            fish_weight: number,
            specie_code: number,
            fish_quantity: number
        }[]

}