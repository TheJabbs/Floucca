import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {LandingsService} from "./landings.service";
import {idDTO} from "../../shared/dto/id.dto";
import {CreateLandingDto} from "./dto/createLandings.dto";
import {UpdateLandingsDto} from "./dto/updateLandings.dto";
import {CreateFormLandingDto} from "./dto/CreateFormLanding.dto";
import {GeneralFilterDto} from "../../shared/dto/GeneralFilter.dto";
import {FishService} from "../fish/fish.service";
import {SenseLastwController} from "../sense_lastw/sense_lastw.controller";

@Controller("api/dev/landings")
export class LandingsController {
    constructor(private readonly service: LandingsService,
                private readonly fishService: FishService,
                private readonly senseController: SenseLastwController) {
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

    @Post("/create/form")
    createFormLanding(@Body() formLanding: CreateFormLandingDto) {
        return this.service.createLandingForm(formLanding);
    }

    @Post('/cpue')
    async getCpue(@Body() filter: GeneralFilterDto) {
        const landings = await this.service.getLandingsByFilter(filter);
        let fishWeight = 0

        landings.forEach(landing => {
            landing.fish.forEach(fish => {
                fishWeight += fish.fish_weight
            })
        })

        return (fishWeight/landings.length)
    }

    @Post('/effortbyspecie/:code')
    async getEffortBySpecie(@Param('code') code: idDTO, @Body() filter: GeneralFilterDto) {
        const cpue = await this.getCpue(filter);
        const fishes = await this.fishService.getAllFishByFilter(filter, code);

        let fishWeight = 0
        fishes.forEach(fish => {
            fishWeight += fish.fish_weight
        })

        return fishWeight/cpue
    }

    @Post('/estimateCatch')
    async getEstimateCatch(@Body() filter: GeneralFilterDto){
        delete filter.gear_code

        return await this.senseController.getEstimateEffort(filter) * await this.getCpue(filter);
    }


}