import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common';
import {LandingsService} from "./landings.service";
import {idDTO} from "../../shared/dto/id.dto";
import {CreateLandingDto} from "./dto/create_landings.dto";
import {UpdateLandingsDto} from "./dto/update_landings.dto";
import {CreateFormLandingDto} from "./dto/create_form_landing.dto";
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../../auth/guards/roles.guard";
import {Roles} from "../../auth/decorators/roles.decorator";
import {RoleEnum} from "../../auth/enums/role.enum";


@Controller("api/dev/landings")
export class LandingsController {
    constructor(private readonly service: LandingsService) {
    }

    @Post("/coordinates")
    getCoordinates(@Body() filter: GeneralFilterDto){
        return this.service.getCoordinates(filter);
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(RoleEnum.ADMIN)
    @Post("/create/form")
    createFormLanding(@Body() formLanding: CreateFormLandingDto, @Req() req: Request) {
       formLanding.boat_details = {}
        const user = req.json()
        return this.service.createLandingForm(formLanding);
    }
}