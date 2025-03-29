import {GetFilteredInterface} from "../../backend/landings/interface/get_filtered.interface";

export function mapLandingsAndEffortMapper(landings: any[]): Map<number, any[]> {
    let mapper : Map<number, GetFilteredInterface[]> = new Map();

    // mapping the landings to the port_id
    landings.forEach(landing => {
        if (mapper.has(landing.form.port_id)) {
            mapper.get(landing.form.port_id).push(landing);
        } else {
            mapper.set(landing.form.port_id, [landing]);
        }
    });

    return mapper;
}