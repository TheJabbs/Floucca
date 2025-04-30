import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {GearUsageService} from "./gear_usage.service";
import {idDTO} from "../../shared/dto/id.dto";
import {CreateGearUsageDto} from "./dto/create_gear_usage.dto";
import {UpdateGearUsageDto} from "./dto/update_gear_usage.dto";

@Controller('api/dev/gear_usage')
export class GearUsageController {
    constructor(private readonly gearUsageService: GearUsageService) {
    }

    @Get('/all/gear_usage')
    getAllGearUsage() {
        return this.gearUsageService.getAllGearUsage();
    }

    @Get('/gear_usage/:gear_usage_id')
    getGearUsageByGearUsageId(@Param('gear_usage_id') gearUsageId: idDTO) {
        return this.gearUsageService.getGearUsageById(gearUsageId.id);
    }

    @Post('/create/gear_usage')
    createGearUsage(@Body() newGearUsage: CreateGearUsageDto) {
        return this.gearUsageService.createGearUsage(newGearUsage);
    }

    @Put('/update/gear_usage/:gear_usage_id')
    updateGearUsage(@Param('gear_usage_id') gearUsageId: idDTO, @Body() updatedGearUsage: UpdateGearUsageDto) {
        return this.gearUsageService.updateGearUsage(gearUsageId.id, updatedGearUsage);
    }

    @Delete('/delete/gear_usage/:gear_usage_id')
    deleteGearUsage(@Param('gear_usage_id') gearUsageId: idDTO) {
        return this.gearUsageService.deleteGearUsage(gearUsageId.id);
    }
}

