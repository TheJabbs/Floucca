import { FishInterface } from "../interface/fish.interface";
import { FishStatInterface } from "../interface/fishStat.interface";
import {FishV2Interface} from "../interface/fishV2.interface";

export function fishStatsMapper(map: Map<string, FishV2Interface[]>): Record<string, Record<number, FishStatInterface>> {
    const fishStatsMap: Map<string, Map<number, FishStatInterface>> = new Map();

    map.forEach((fishes, period) => {
        const specieMap: Map<number, { stats: FishStatInterface, count: number }> = new Map();

        fishes.forEach((fish) => {
            if (!specieMap.has(fish.specie_code)) {
                specieMap.set(fish.specie_code, {
                    stats: {
                        specie_name: fish.specie_name,
                        avg_quantity: 0,
                        avg_weight: 0,
                        avg_length: 0,
                        avg_price: 0
                    },
                    count: 0
                });
            }

            const entry = specieMap.get(fish.specie_code)!;
            entry.count += 1;
            entry.stats.avg_quantity += fish.fish_quantity;
            entry.stats.avg_weight += fish.fish_weight;
            entry.stats.avg_length += fish.fish_length;
            entry.stats.avg_price += fish.price;
        });

        const finalSpecieMap: Map<number, FishStatInterface> = new Map();
        specieMap.forEach((entry, specie_code) => {
            finalSpecieMap.set(specie_code, {
                specie_name: entry.stats.specie_name,
                avg_quantity: entry.stats.avg_quantity / entry.count,
                avg_weight: entry.stats.avg_weight / entry.count,
                avg_length: entry.stats.avg_length / entry.count,
                avg_price: entry.stats.avg_price / entry.count
            });
        });

        fishStatsMap.set(period, finalSpecieMap);
    });

    return Object.fromEntries(
        [...fishStatsMap.entries()].map(([period, species]) => [
            period,
            Object.fromEntries(species)
        ])
    );
}
