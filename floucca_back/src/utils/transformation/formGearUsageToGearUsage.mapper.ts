import { FormGearUsageDto } from '../../backend/gear_usage/dto/FormGearUsage.dto';
import { CreateGearUsageDto } from '../../backend/gear_usage/dto';

export function transformFormGearUsageToGearUsage(formGearUsage: FormGearUsageDto[]): CreateGearUsageDto[] {
    if (!Array.isArray(formGearUsage)) {
        throw new TypeError('Expected an array of FormGearUsageDto');
    }

    const gearUsage: CreateGearUsageDto[] = [];
    formGearUsage.forEach((formGear) => {
        if (Array.isArray(formGear.months)) {
            formGear.months.forEach((month) => {
                gearUsage.push({
                    gear_code: formGear.gear_code,
                    months: month
                });
            });
        } else {
            throw new TypeError('Expected months to be an array');
        }
    });

    return gearUsage;
}