import {Module} from "@nestjs/common";
import {GearDetailController} from "./gear_detail.controller";
import {GearDetailService} from "./gear_detail.service";

@Module({
    imports: [],
    controllers: [GearDetailController],
    providers: [GearDetailService],
})
export class GearDetailModule {}
