import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {LandingsService} from "./landings.service";
import {idDTO} from "../../shared/dto/id.dto";
import {CreateLandingDto} from "./dto/createLandings.dto";
import {UpdateLandingsDto} from "./dto/updateLandings.dto";

@Controller("api/dev/landings")
export class LandingsController {
    constructor(private readonly service: LandingsService) {
    }

    @Get("/all/landings")
    getAllLandings() {
        return this.service.getAllLandings();
    }

    @Get("/landings/:landing_id")
    getLandingById(@Param("landing_id") landing_id: idDTO) {
        return this.service.getLandingById(landing_id.id);
    }

    @Post("/create/landings")
    createLanding(@Body() newLanding: CreateLandingDto) {
        return this.service.createLanding(newLanding);
    }

    @Delete("/delete/landings/:landing_id")
    deleteLanding(@Param("landing_id") landing_id: idDTO) {
        return this.service.deleteLanding(landing_id.id);
    }

    @Put("/update/landings/:landing_id")
    updateLanding(@Param("landing_id") landing_id: idDTO, @Body() updatedLanding: UpdateLandingsDto) {
        return this.service.updateLanding(landing_id.id, updatedLanding);
    }


}