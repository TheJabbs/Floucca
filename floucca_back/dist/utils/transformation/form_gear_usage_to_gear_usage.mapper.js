"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformFormGearUsageToGearUsage = transformFormGearUsageToGearUsage;
function transformFormGearUsageToGearUsage(formGearUsage) {
    if (!Array.isArray(formGearUsage)) {
        throw new TypeError('Expected an array of FormGearUsageDto');
    }
    const gearUsage = [];
    formGearUsage.forEach((formGear) => {
        if (Array.isArray(formGear.months)) {
            formGear.months.forEach((month) => {
                gearUsage.push({
                    gear_code: formGear.gear_code,
                    months: month
                });
            });
        }
        else {
            throw new TypeError('Expected months to be an array');
        }
    });
    return gearUsage;
}
//# sourceMappingURL=form_gear_usage_to_gear_usage.mapper.js.map