import {CreateGearUsageDto, UpdateGearUsageDto, GearUsageIdDto} from "./DTO/index"
import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {GearUsageService} from "./gear_usage.service";

@Controller('api/dev/gear_usage')
export class GearUsageController {
    constructor(private readonly gearUsageService: GearUsageService) {
    }

    @Get('/all/gear_usage')
    getAllGearUsage() {
        return this.gearUsageService.getAllGearUsage();
    }

    @Get('/gear_usage/:gear_usage_id')
    getGearUsageByGearUsageId(@Param('gear_usage_id') gearUsageId: GearUsageIdDto) {
        return this.gearUsageService.getGearUsageById(gearUsageId.usage_id);
    }

    @Post('/create/gear_usage')
    createGearUsage(@Body() newGearUsage: CreateGearUsageDto) {
        return this.gearUsageService.createGearUsage(newGearUsage);
    }

    @Put('/update/gear_usage/:gear_usage_id')
    updateGearUsage(@Param('gear_usage_id') gearUsageId: GearUsageIdDto, @Body() updatedGearUsage: UpdateGearUsageDto) {
        return this.gearUsageService.updateGearUsage(gearUsageId.usage_id, updatedGearUsage);
    }

    @Delete('/delete/gear_usage/:gear_usage_id')
    deleteGearUsage(@Param('gear_usage_id') gearUsageId: GearUsageIdDto) {
        return this.gearUsageService.deleteGearUsage(gearUsageId.usage_id);
    }
}

