import { Module } from '@nestjs/common';
import { SenseLastwController } from './sense_lastw.controller';
import { SenseLastwService } from './sense_lastw.service';
import {GearModule} from "../gear/gear.module";

@Module({
    imports: [],
    controllers: [SenseLastwController],
    providers: [SenseLastwService, GearModule],
})
export class SenseLastwModule {}
