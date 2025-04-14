import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {PeriodService} from "./period.service";
import {UpdateGearDetailDto} from "../gear_detail/dto/update_gear_detail.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {UpdatePeriodAndActiveDaysDto} from "./dto/UpdatePeriodAndActiveDays.dto";
import {UpdatePeriodDto} from "./dto/update_period.dto";

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
   async  updatePeriod(@Param('period_id') periodId: string, @Body() updatedPeriod: UpdatePeriodDto) {
        return this.periodService.updatePeriod(periodId, updatedPeriod);
    }

    @Delete('/delete/period/:period_id')
    async deletePeriod(@Param('period_id') periodId: Date): Promise<ResponseMessage<any>> {
        return this.periodService.deletePeriod(periodId);
    }

    //===============================================

    @Get('/all/period/active_days')
    async getAllPeriodWithActiveDays() {
        return this.periodService.getPeriodsWithActiveDays();
    }

    @Put('/update/period/active_days')
    async updatePeriodAndActiveDays(@Body() updatedPeriod: UpdatePeriodAndActiveDaysDto): Promise<ResponseMessage<any>> {
        return this.periodService.updatePeriodWithActiveDays(updatedPeriod);
    }
}
