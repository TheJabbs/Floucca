import { FishAnalyticMapperInterface } from "../interface/fishAnalyticMapper.interface";
import {FishStatInterface} from "../interface/fish_stat.interface";

export function fishStatsMapper(data: FishAnalyticMapperInterface[]): any {
    const fishStatsMap: Map<string, Map<number, FishAnalyticMapperInterface[]>> = new Map();

    for (const d of data) {
        const periodKey = d.period_date.toLocaleDateString();
        let statsInterfaceMap = fishStatsMap.get(periodKey);

        if (!statsInterfaceMap) {
            statsInterfaceMap = new Map();
            fishStatsMap.set(periodKey, statsInterfaceMap);
        }

        if (!statsInterfaceMap.has(d.specie_code)) {
            statsInterfaceMap.set(d.specie_code, []);
        }

        statsInterfaceMap.get(d.specie_code)!.push(d);
    }

    const fishStats: Map<string, Map<number, FishStatInterface>> = new Map();
    for (const [period, speciesMap] of fishStatsMap) {
        const speciesStats: Map<number, FishStatInterface> = new Map();

        for (const [specieCode, fishes] of speciesMap) {
            const avgLength = fishes.reduce((acc, fish) => acc + fish.fish_length, 0) / fishes.length;
            const avgWeight = fishes.reduce((acc, fish) => acc + fish.fish_weight, 0) / fishes.length;
            const avgPrice = fishes.reduce((acc, fish) => acc + fish.price, 0) / fishes.length;
            const avgQuantity = fishes.reduce((acc, fish) => acc + fish.fish_quantity, 0) / fishes.length;

            const fishStat: FishStatInterface = {
                specie_name: fishes[0].specie_name,
                avg_length: avgLength,
                avg_weight: avgWeight,
                avg_price: avgPrice,
                avg_quantity: avgQuantity
            };

            speciesStats.set(specieCode, fishStat);
        }

        fishStats.set(period, speciesStats);
    }

    //make it return a record
    const result: Record<string, Record<number, FishStatInterface>> = {};
    for (const [period, speciesMap] of fishStats) {
        const speciesStats: Record<number, FishStatInterface> = {};
        for (const [specieCode, fishStat] of speciesMap) {
            speciesStats[specieCode] = fishStat;
        }
        result[period] = speciesStats;
    }

    return result;
}