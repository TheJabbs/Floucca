import { GetFilteredLastWInterface } from "../../../backend/sense_lastw/interface/get_filtered_lastw.interface";

export function mergeEffortMapper(data: GetFilteredLastWInterface[]): GetFilteredLastWInterface[] {
    const mergedMap = new Map<string, { totalDays: number; count: number; entry: GetFilteredLastWInterface }>();

    for (const item of data) {
        const key = `${item.gear_code ?? 'null'}-${item.form.form_id}`;

        if (mergedMap.has(key)) {
            const existing = mergedMap.get(key)!;
            const days = item.days_fished ?? 0;
            const newCount = existing.count + 1;
            const newTotal = existing.totalDays + days;

            mergedMap.set(key, {
                totalDays: newTotal,
                count: newCount,
                entry: {
                    ...existing.entry,
                    days_fished: newTotal / newCount,
                },
            });
        } else {
            mergedMap.set(key, {
                totalDays: item.days_fished ?? 0,
                count: 1,
                entry: { ...item },
            });
        }
    }

    return Array.from(mergedMap.values()).map(e => e.entry);
}
