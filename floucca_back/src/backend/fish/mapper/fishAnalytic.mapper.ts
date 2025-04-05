import {GetFishesMappedByPeriodInterface} from "../interface/get_fishes_mapped_by_period.interface";
import {FishAnalyticMapperInterface} from "../interface/fishAnalyticMapper.interface";

export function fishAnalyticMapper(data: GetFishesMappedByPeriodInterface[]): FishAnalyticMapperInterface[]{
    const fishAnalytic: FishAnalyticMapperInterface[] = [];
    for (const d of data) {
        for (const f of d.form) {
            for (const l of f.landing) {
                for (const fish of l.fish) {
                    const fishAnalyticInterface: FishAnalyticMapperInterface = {
                        fish_length: fish.fish_length,
                        fish_quantity: fish.fish_quantity,
                        fish_weight: fish.fish_weight,
                        price: fish.price,
                        specie_code: fish.specie_code,
                        specie_name: fish.specie.specie_name,
                        period_date: d.period_date
                    };
                    fishAnalytic.push(fishAnalyticInterface);
                }
            }
        }
    }
    return fishAnalytic;
}