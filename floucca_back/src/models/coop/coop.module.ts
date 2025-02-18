import {Module} from "@nestjs/common";
import {CoopController} from "./coop.controller";
import {CoopService} from "./coop.service";

@Module({
    imports: [],
    controllers: [CoopController],
    providers: [CoopService],
})
export class CoopModule{}