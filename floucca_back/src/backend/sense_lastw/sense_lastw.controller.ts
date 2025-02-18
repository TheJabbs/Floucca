import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { SenseLastwService } from './sense_lastw.service';
import { CreateSenseLastwDto } from './dto/create-sense_lastw.dto';
import { UpdateSenseLastwDto } from './dto/update-sense_lastw.dto';
import { idDTO } from '../../shared/dto/id.dto';

@Controller('api/dev/sense_lastw')
export class SenseLastwController {
    constructor(private readonly service: SenseLastwService) {}

    @Get('/all/sense_lastw')
    getAllSenseLastw() {
        return this.service.getAllSenseLastw();
    }

    @Get('/sense_lastw/:sense_lastw_id')
    getSenseLastwById(@Param('sense_lastw_id') sense_lastw_id: idDTO) {
        return this.service.getSenseLastwById(sense_lastw_id.id);
    }

    @Post('/create/sense_lastw')
    createSenseLastw(@Body() newSenseLastw: CreateSenseLastwDto) {
        return this.service.createSenseLastw(newSenseLastw);
    }

    @Delete('/delete/sense_lastw/:sense_lastw_id')
    deleteSenseLastw(@Param('sense_lastw_id') sense_lastw_id: idDTO) {
        return this.service.deleteSenseLastw(sense_lastw_id.id);
    }

    @Put('/update/sense_lastw/:sense_lastw_id')
    updateSenseLastw(
        @Param('sense_lastw_id') sense_lastw_id: idDTO,
        @Body() updatedSenseLastw: UpdateSenseLastwDto,
    ) {
        return this.service.updateSenseLastw(sense_lastw_id.id, updatedSenseLastw);
    }
}
