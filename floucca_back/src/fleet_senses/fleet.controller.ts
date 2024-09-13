import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {FleetService} from "./fleet.service";
import {FleetIdDto} from "./DTO/FleetId.dto";
import {CreateFleetDto} from "./DTO";

@Controller('api/dev/fleet_senses')
export class FleetController {
    constructor(private readonly fleetService: FleetService) {
    }

    @Get('/all/fleet_senses')
    getAllFleetSenses() {
        return this.fleetService.getAllFleet();
    }

    @Get('/fleet_senses/:fleet_senses_id')
    getFleetSensesByFSID(@Param('fleet_senses_id') FSID: FleetIdDto) {
        return this.fleetService.getFleetById(FSID.fleet_senses_id);
    }

    @Post('/create/fleet_senses')
    createFleetSenses(@Body() newFleet: CreateFleetDto) {
        return this.fleetService.createFleet(newFleet);
    }

    @Delete('/delete/fleet_senses/:fleet_senses_id')
    deleteFleetSenses(@Param('fleet_senses_id') FSID: FleetIdDto) {
        return this.fleetService.deleteFleet(FSID.fleet_senses_id);
    }

    @Put('/update/fleet_senses/:fleet_senses_id')
    updateFleetSenses(@Param('fleet_senses_id') FSID: FleetIdDto, @Body() updatedFleet: CreateFleetDto) {
        return this.fleetService.updateFleet(FSID.fleet_senses_id, updatedFleet);
    }

}