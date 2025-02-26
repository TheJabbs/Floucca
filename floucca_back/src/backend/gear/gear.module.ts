import {Module} from "@nestjs/common";
import {GearController} from "./gear.controller";
import {GearService} from "./gear.service";

@Module({
    imports: [],
    controllers: [GearController],
    providers: [GearService],
    exports: [GearService]
})
export class GearModule {}