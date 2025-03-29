"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterToFilteredInterfaceMapper = filterToFilteredInterfaceMapper;
function filterToFilteredInterfaceMapper(data) {
    const filteredData = [];
    data.forEach(landing => {
        const form = {
            form_id: landing.form.form_id,
            port_id: landing.form.port_id
        };
        const fish = landing.fish.map(fish => {
            return {
                specie_code: fish.specie_code,
                fish_weight: fish.fish_weight,
                fish_length: fish.fish_length,
                fish_quantity: fish.fish_quantity,
                price: fish.price,
                specieName: fish.specie.specie_name
            };
        });
        filteredData.push({ form, fish });
    });
    return filteredData;
}
//# sourceMappingURL=filterToFilteredInterface.mapper.js.map