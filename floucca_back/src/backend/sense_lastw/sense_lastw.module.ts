import { Module } from '@nestjs/common';
import { SenseLastwController } from './sense_lastw.controller';
import { SenseLastwService } from './sense_lastw.service';

@Module({
    imports: [],
    controllers: [SenseLastwController],
    providers: [SenseLastwService],
    exports: [SenseLastwService]
})
export class SenseLastwModule {}
