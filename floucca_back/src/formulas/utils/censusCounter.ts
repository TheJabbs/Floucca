import {FleetReportInterface} from "../../backend/fleet_senses/interface/fleetReport.interface";

export function censusCounter(fleetCensus: FleetReportInterface[]){
    let totalGears = 0;

    fleetCensus.forEach((element) => {
        totalGears += element.freq;
    })
    return totalGears;
}