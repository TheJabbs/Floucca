import {FormGearUsageDto} from "../../models/gear_usage/DTO/FormGearUsage.dto";
import {CreateGearUsageDto} from "../../models/gear_usage/DTO";

export function transformFormGearUsageToGearUsage(formGearUsage: FormGearUsageDto[]): CreateGearUsageDto[] {
    const gearUsage: CreateGearUsageDto[] = [];
    formGearUsage.forEach((formGear) => {
        formGear.months.forEach((month) => {
            gearUsage.push({
                gear_code: formGear.gear_code,
                months: month
            });
        });
    });

    return gearUsage;
}