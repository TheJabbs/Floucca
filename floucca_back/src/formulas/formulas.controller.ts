import {Body, Controller, Get, Post,} from '@nestjs/common';
import {FormulasService} from "./formulas.service";
import {GeneralFilterDto} from "../shared/dto/general_filter.dto";

@Controller('api/dev/formulas')
export class FormulasController {
    constructor(private readonly service: FormulasService) {
    }

    // @Post('/cpue')
    // async getCpue(@Body() filter: GeneralFilterDto) {
    //     return this.service.getCpue(filter);
    // }
    //
    // @Post('/effortBySpecies/')
    // async getEffortBySpecies(@Body() filter: GeneralFilterDto) {
    //     return this.service.getEffortBySpecies(filter);
    // }
    //
    // @Post('/pba')
    // async getPba(@Body() filter: GeneralFilterDto) {
    //     return this.service.getPba(filter);
    // }
    //
    // @Post('/totalEffort')
    // async getTotalEffort(@Body() filter: GeneralFilterDto) {
    //    // return this.service.getTotalEffort(filter);
    // }
    //
    // @Post('/activeDays')
    // async getActiveDays(@Body() filter: GeneralFilterDto) {
    //     return this.service.getActiveDays(filter);
    // }
    //
    // @Post('/estmEffort')
    // async getEstmEffort(@Body() filter: GeneralFilterDto) {
    //     return this.service.getEstimateEffort(filter);
    // }
    //
    // @Post('estmCatch')
    // async getEstmCatch(@Body() filter: GeneralFilterDto) {
    //     return this.service.getEstimateCatch(filter);
    // }

    @Post('report/effort&landing')
    async getEffortAndLanding(@Body() filter: GeneralFilterDto) {
        return this.service.getReportData(filter);
    }

    @Get('report/leftPanel')
    async getLeftPanelInfo() {
        return this.service.getLeftPanelInfo();
    }

    @Get()
    async test(){
        return Promise.all([this.service.getAllFishingGears(), this.service.getLandingRecordsByPeriod()])
    }

    @Post('report/workloadstat')
    async getWorkloadStat(@Body() filter: GeneralFilterDto) {
        return this.service.generateWorkloadStatistics(filter);
    }

}
