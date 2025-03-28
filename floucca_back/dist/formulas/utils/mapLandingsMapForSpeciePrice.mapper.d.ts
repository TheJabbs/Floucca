import { GetFilteredInterface } from "../../backend/landings/interface/getFiltered.interface";
export declare function mapLandingsMapForSpeciePriceMapper(landingsMap: Map<number, GetFilteredInterface[]>): Map<number, Map<number, {
    fishTotalPrice: number;
    count: number;
}>>;
