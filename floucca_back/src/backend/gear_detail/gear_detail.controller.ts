import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';

import {CreateGearDetailDto} from "./dto/create_gear_detail.dto";
import {GearDetailService} from "./gear_detail.service";
import {idDTO} from "../../shared/dto/id.dto";
import {UpdateGearDetailDto} from "./dto/update_gear_detail.dto";

@Controller("api/dev/gear_detail")
export class GearDetailController {
    constructor(private readonly service: GearDetailService) {
    }

    @Get("/all/gear_detail")
    getAllGearDetail() {
        return this.service.getAllGearDetail();
    }

    @Get("/gear_detail/:gear_detail_code")
    getGearDetailByCode(@Param("gear_detail_code") gear_detail_code: idDTO) {
        return this.service.getGearDetailById(gear_detail_code.id);
    }

    @Post("/create/gear_detail")
    createGearDetail(@Body() newGearDetail: CreateGearDetailDto) {
        return this.service.createGearDetail(newGearDetail);
    }

    @Delete("/delete/gear_detail/:gear_detail_code")
    deleteGearDetail(@Param("gear_detail_code") gear_detail_code: idDTO) {
        return this.service.deleteGearDetail(gear_detail_code.id);
    }

    @Put("/update/gear_detail/:gear_detail_code")
    updateGearDetail(@Param("gear_detail_code") gear_detail_code: idDTO, @Body() updatedGearDetail: UpdateGearDetailDto) {
        return this.service.updateGearDetail(gear_detail_code.id, updatedGearDetail);
    }

}