import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {PeriodService} from "./period.service";
import {UpdateGearDetailDto} from "../gear_detail/dto/update_gear_detail.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";

@Controller('api/dev/period')
export class PeriodController {
    constructor(private readonly periodService: PeriodService) {
    }

    @Get('/all/period')
    async getAllPeriod() {
        return this.periodService.getAllPeriod();
    }

    @Get('/period/:period_id')
   async  getPeriodById(@Param('period_id') periodId: Date) {
        return this.periodService.getPeriodById(periodId);
    }

    @Put('/update/period/:period_id')
   async  updatePeriod(@Param('period_id') periodId: Date, @Body() updatedPeriod: UpdateGearDetailDto) {
        return this.periodService.updatePeriod(periodId, updatedPeriod);
    }

    @Delete('/delete/period/:period_id')
    async deletePeriod(@Param('period_id') periodId: Date): Promise<ResponseMessage<any>> {
        return this.periodService.deletePeriod(periodId);
    }
}