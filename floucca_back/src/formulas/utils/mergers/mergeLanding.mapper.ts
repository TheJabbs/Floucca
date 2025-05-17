import {GetFilteredInterface} from "../../../backend/landings/interface/get_filtered.interface";

export function mergeLandingMapper(input: GetFilteredInterface[]): GetFilteredInterface[] {
    const mergedMap = new Map<string, {
        totalWeight: number;
        weightedPrice: number;
        weightedLength: number;
        weightedQuantity: number;
        base: GetFilteredInterface;
    }>();

    for (const item of input) {
        if (!item.fish) continue;

        const { form, fish } = item;
        const key = `${form.form_id}-${form.port_id}-${fish.specie_code}-${fish.gear_code}`;

        const fishWeight = fish.fish_weight ?? 0;

        if (mergedMap.has(key)) {
            const entry = mergedMap.get(key)!;
            const totalWeight = entry.totalWeight + fishWeight;

            mergedMap.set(key, {
                totalWeight,
                weightedPrice: (entry.weightedPrice * entry.totalWeight + (fish.price ?? 0) * fishWeight) / totalWeight,
                weightedLength: (entry.weightedLength * entry.totalWeight + (fish.fish_length ?? 0) * fishWeight) / totalWeight,
                weightedQuantity: (entry.weightedQuantity * entry.totalWeight + (fish.fish_quantity ?? 0) * fishWeight) / totalWeight,
                base: {
                    form,
                    fish: {
                        ...fish,
                        fish_weight: totalWeight,
                        price: 0,          // will replace later
                        fish_length: 0,    // will replace later
                        fish_quantity: 0,  // will replace later
                    }
                }
            });
        } else {
            mergedMap.set(key, {
                totalWeight: fishWeight,
                weightedPrice: fish.price ?? 0,
                weightedLength: fish.fish_length ?? 0,
                weightedQuantity: fish.fish_quantity ?? 0,
                base: {
                    form,
                    fish: { ...fish }
                }
            });
        }
    }

    // Final output with updated weighted values
    return Array.from(mergedMap.values()).map(entry => ({
        form: entry.base.form,
        fish: {
            ...entry.base.fish!,
            price: entry.weightedPrice,
            fish_length: entry.weightedLength,
            fish_quantity: entry.weightedQuantity,
        }
    }));
}
