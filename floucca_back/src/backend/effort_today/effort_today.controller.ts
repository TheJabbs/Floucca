import {EffortTodayService} from "./effort_today.service";
import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CreateEffortTodayDto} from "./dto/effort_today.Dto";
import {idDTO} from "../../shared/dto/id.dto";
import {UpdateEffortDto} from "./dto/updateEffort.dto";

@Controller('api/effort_today')
export class EffortTodayController {
    constructor(private readonly effortTodayService: EffortTodayService) {
    }

    @Get('/all')
    getAllEffortToday() {
        return this.effortTodayService.getAllEffortToday();
    }

    @Get('/:id')
    getEffortTodayById(@Param('id') id: idDTO) {
        return this.effortTodayService.getEffortTodayById(id.id);
    }

    @Post('/create')
    createEffortToday(@Body() effort_today: CreateEffortTodayDto) {
        return this.effortTodayService.createEffortToday(effort_today);
    }

    @Put('/update/:id')
    updateEffortToday(@Body() effort_today: UpdateEffortDto, @Param('id') id: idDTO) {
        const check = this.effortTodayService.getEffortTodayById(id.id);
        if (!check) {
            return "Effort today does not exist"
        }
        return this.effortTodayService.updateEffortToday(id.id, effort_today);
    }

    @Delete('/delete/:id')
    deleteEffortToday(@Param('id') id: idDTO) {
        const check = this.effortTodayService.getEffortTodayById(id.id);
        if (!check) {
            return "Effort today does not exist"
        }
        return this.effortTodayService.deleteEffortToday(id.id);
    }
}