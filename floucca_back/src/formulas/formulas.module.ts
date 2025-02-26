import {Module} from "@nestjs/common";
import {FormulasController} from "./formulas.controller";
import {FormulasService} from "./formulas.service";
import {FishModule} from "../backend/fish/fish.module";
import {LandingsModule} from "../backend/landings/landings.module";
import {SenseLastwModule} from "../backend/sense_lastw/sense_lastw.module";
import {GearModule} from "../backend/gear/gear.module";

@Module({
    imports: [FishModule, LandingsModule, SenseLastwModule, GearModule],
    controllers: [FormulasController],
    providers: [FormulasService],
})
export class FormulasModule{}