"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapLandingsAndEffortMapper = mapLandingsAndEffortMapper;
function mapLandingsAndEffortMapper(landings) {
    let mapper = new Map();
    landings.forEach(landing => {
        if (mapper.has(landing.form.port_id)) {
            mapper.get(landing.form.port_id).push(landing);
        }
        else {
            mapper.set(landing.form.port_id, [landing]);
        }
    });
    return mapper;
}
//# sourceMappingURL=map_landings_and_effort.mapper.js.map