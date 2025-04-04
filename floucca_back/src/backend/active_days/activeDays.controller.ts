import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {ActiveDaysService} from "./activeDays.service";
import {CreateActiveDaysDto} from "./dto/createActiveDays.dto";
import {UpdateActiveDaysDto} from "./dto/updateActiveDays.dto";

@Controller('api/dev/active_days')
export class ActiveDaysController {
    constructor(private readonly service: ActiveDaysService) {
    }

        @Get('/all/active_days')
    getAllActiveDays() {
        return this.service.getAllActiveDays();
    }

    @Get('/active_days/:active_id')
    getActiveDaysById(@Param('active_id') active_id: number) {
        return this.service.getActiveDaysById(active_id);
    }

    @Post('/create/active_days')
    createActiveDays(@Body() newActiveDays: CreateActiveDaysDto) {
        return this.service.createActiveDays(newActiveDays);
    }

    @Put('/update/active_days/:active_id')
    updateActiveDays(@Param('active_id') active_id: number, @Body() updatedActiveDays : UpdateActiveDaysDto) {
        return this.service.updateActiveDays(active_id, updatedActiveDays);
    }

    @Delete('/delete/active_days/:active_id')
    deleteActiveDays(@Param('active_id') active_id: number) {
        return this.service.deleteActiveDays(active_id);
    }

    @Get()
    test(){
        return this.service.test()
    }

}