import {Module} from "@nestjs/common";
import {BoatDetailService} from "./boat_detail.service";
import {BoatDetailController} from "./boat_detail.controller";


@Module({
    imports: [],
    controllers: [BoatDetailController],
    providers: [BoatDetailService],
})
export class BoatDetailModule {
}