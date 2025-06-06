import {CoopDto} from "../dto/coop.dto";
import {CoopInterface} from "../interface/coop.interface";

export function mapCoopToReturnCoopInterface(coop : CoopDto) : CoopInterface{
    return {
        coop_code: coop.coop_code,
        region_code: coop.region_code,
        coop_name: coop.coop_name
    }
}