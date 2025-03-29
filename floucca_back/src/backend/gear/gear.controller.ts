import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {GearService} from "./gear.service";
import {GearIdDto} from "./dto/gear_id.dto";
import {CreateGearDto} from "./dto/create_gear.dto";

@Controller("api/dev/gear")
export class GearController {
    constructor(private readonly service: GearService) {
    }

    @Get("/all/gear")
    getAllGear() {
        return this.service.getAllGear();
    }

    @Get("/gear/:gear_code")
    getGearByCode(@Param("gear_code") gear_code: GearIdDto) {
        return this.service.getGearById(gear_code.gear_id);
    }

    @Post("/create/gear")
    createGear(@Body() newGear: CreateGearDto) {
        return this.service.createGear(newGear);
    }

    @Delete("/delete/gear/:gear_code")
    deleteGear(@Param("gear_code") gear_code: GearIdDto) {
        return this.service.deleteGear(gear_code.gear_id);
    }

    @Put("/update/gear/:gear_code")
    updateGear(@Param("gear_code") gear_code: GearIdDto, @Body() updatedGear: CreateGearDto) {
        return this.service.updateGear(gear_code.gear_id, updatedGear);
    }

}