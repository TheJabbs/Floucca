import {Module} from "@nestjs/common";
import {FormulasController} from "./formulas.controller";
import {FormulasService} from "./formulas.service";
import {FishModule} from "../backend/fish/fish.module";
import {LandingsModule} from "../backend/landings/landings.module";
import {SenseLastwModule} from "../backend/sense_lastw/sense_lastw.module";
import {GearModule} from "../backend/gear/gear.module";
import {FleetModule} from "../backend/fleet_senses/fleet.module";
import {ActiveDaysModule} from "../backend/active_days/activeDays.module";

@Module({
    imports: [FishModule, LandingsModule, SenseLastwModule,
        GearModule, FleetModule, ActiveDaysModule],
    controllers: [FormulasController],
    providers: [FormulasService],
})
export class FormulasModule{}