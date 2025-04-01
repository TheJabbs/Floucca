import { GetFishesMappedByPeriodInterface } from "../interface/get_fishes_mapped_by_period.interface";
import {FishV2Interface} from "../interface/fish_v2.interface";

export function getFishesMapperByPeriodMapper(data: GetFishesMappedByPeriodInterface[]): Map<string, FishV2Interface[]> {
    const mapUsingPeriodDate: Map<string, FishV2Interface[]> = new Map();

    for (const d of data) {
        const periodKey = d.period_date.toISOString(); // Convert Date to string

        for (const f of d.form) {
            for (const l of f.landing) {
                for (const fish of l.fish) {
                    const fishInterface: FishV2Interface = {
                        fish_length: fish.fish_length,
                        fish_quantity: fish.fish_quantity,
                        fish_weight: fish.fish_weight,
                        price: fish.price,
                        specie_code: fish.specie_code,
                        specie_name: fish.specie.specie_name
                    };

                    if (!mapUsingPeriodDate.has(periodKey)) {
                        mapUsingPeriodDate.set(periodKey, []);
                    }

                    mapUsingPeriodDate.get(periodKey)!.push(fishInterface);
                }
            }
        }
    }

    return mapUsingPeriodDate;
}
