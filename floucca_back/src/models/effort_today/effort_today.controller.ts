import {EffortTodayService} from "./effort_today.service";
import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {EffortTodayDto} from "./dto/effort_today.Dto";

@Controller('api/effort_today')
export class EffortTodayController {
    constructor(private readonly effortTodayService: EffortTodayService) {
    }

    @Get('/all')
    getAllEffortToday() {
        return this.effortTodayService.getAllEffortToday();
    }

    @Get('/:id')
    getEffortTodayById(@Param('id') id: number) {
        return this.effortTodayService.getEffortTodayById(id);
    }

    @Post('/create')
    createEffortToday(@Body() effort_today: EffortTodayDto) {
        return this.effortTodayService.createEffortToday(effort_today);
    }

    @Put('/update/:id')
    updateEffortToday(@Body() effort_today: EffortTodayDto, @Param('id') id: number) {
        const check = this.effortTodayService.getEffortTodayById(id);
        if (!check) {
            return "Effort today does not exist"
        }
        return this.effortTodayService.updateEffortToday(id, effort_today);
    }

    @Delete('/delete/:id')
    deleteEffortToday(@Param('id') id: number) {
        const check = this.effortTodayService.getEffortTodayById(id);
        if (!check) {
            return "Effort today does not exist"
        }
        return this.effortTodayService.deleteEffortToday(id);
    }
}