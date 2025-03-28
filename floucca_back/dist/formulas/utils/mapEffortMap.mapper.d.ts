import { GetFilteredLastWInterface } from "../../backend/sense_lastw/interface/getFilteredLastW.interface";
export declare function mapEffortMapMapper(effortMap: Map<number, GetFilteredLastWInterface[]>): Map<number, Map<number, {
    sumDaysFished: number;
    numberOfForms: number;
}>>;
