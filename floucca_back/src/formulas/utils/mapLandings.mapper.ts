import {GetFilteredInterface} from "../../backend/landings/interface/getFiltered.interface";

export function mapLandingsMapper(landings: GetFilteredInterface[]): Map<number, GetFilteredInterface[]> {
    let mapper : Map<number, GetFilteredInterface[]> = new Map();

    // mapping the landings to the port_id
    landings.forEach(landing => {
        if (mapper.has(landing.port_id)) {
            mapper.get(landing.port_id).push(landing);
        } else {
            mapper.set(landing.port_id, [landing]);
        }
    });

    return mapper;
}