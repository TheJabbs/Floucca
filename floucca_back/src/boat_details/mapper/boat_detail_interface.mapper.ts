import {CreateBoatDetailDto} from "../boat_detailDto/boat_detail.Dto";
import {BoatDetailInterface} from "../interface/boat_detail.interface";

export function mapBoatDetailToBoatDetailInterface(boatDetail: CreateBoatDetailDto): BoatDetailInterface {
    return {
        fleet_owner: boatDetail.fleet_owner,
        fleet_size: boatDetail.fleet_size,
        fleet_crew: boatDetail.fleet_crew,
        fleet_max_weigh: boatDetail.fleet_max_weigh,
        fleet_length: boatDetail.fleet_length,
        fleet_registration: boatDetail.fleet_registration
    }
}


