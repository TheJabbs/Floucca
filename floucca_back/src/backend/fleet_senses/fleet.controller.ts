import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {FleetService} from "./fleet.service";

import {idDTO} from "../../shared/dto/id.dto";
import {CreateFleetFormDto} from "./dto/create_fleet_form.dto";
import {transformFormGearUsageToGearUsage} from "../../utils/transformation/form_gear_usage_to_gear_usage.mapper";
import {SenseFormContentInterface} from "./interface/sense_form_content.interface";
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";
import {IsOptional} from "class-validator";
import {CreateBulkDto} from "./dto/createBulk.dto";
import {CreateFleetDto} from "./dto/create_fleet.dto";

@Controller('api/dev/fleet_senses')
export class FleetController {
    constructor(private readonly fleetService: FleetService) {
    }

    @Get('/all/fleet_senses')
    getAllFleetSenses() {
        return this.fleetService.getAllFleet();
    }

    @Get('/fleet_senses/:fleet_senses_id')
    getFleetSensesByFSID(@Param('fleet_senses_id') FSID: idDTO) {
        return this.fleetService.getFleetById(FSID.id);
    }

    @Get('/fleet_senses/gear_usage/:start/:end')
    getAllFleetByDate(@Param('start') start: string, @Param('end') end: string) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return this.fleetService.getAllFleetByDate(startDate, endDate);
    }

    @Post('/create/fleet_senses')
    createFleetSenses(@Body() newFleet: CreateFleetDto) {
        return this.fleetService.createFleet(newFleet);
    }

    @Delete('/delete/fleet_senses/:fleet_senses_id')
    deleteFleetSenses(@Param('fleet_senses_id') FSID: idDTO) {
        return this.fleetService.deleteFleet(FSID.id);
    }

    @Put('/update/fleet_senses/:fleet_senses_id')
    updateFleetSenses(@Param('fleet_senses_id') FSID: idDTO, @Body() updatedFleet: CreateFleetDto) {
        return this.fleetService.updateFleet(FSID.id, updatedFleet);
    }

    @Post("/form/create")
    createSenseForm(@Body() senseForm: CreateFleetFormDto) {
        const form = senseForm.formDto;
        const boatDetails = senseForm.boatDetailDto

        console.log(JSON.stringify(senseForm, null, 2));


        const gearUsage = transformFormGearUsageToGearUsage(senseForm.gearUsageDto);

        const senseFormContent: SenseFormContentInterface = {
            form: form,
            boatDetails: boatDetails,
            gearUsage: gearUsage
        }

        return this.fleetService.createFleetSensesForm(senseFormContent);
    }

    @Post('/report/')
    getFleetSenses(@Body() filter: GeneralFilterDto) {
        return this.fleetService.generateFleetReport(filter);
    }

    @Post('/bulk')
    enterBulk(@Body() bulk: CreateBulkDto){
        console.log("bulk", JSON.stringify(bulk, null, 2));
        return this.fleetService.enterBulk(bulk)
    }

    @Post('/report/:id')
    getFleetSensesWithMo(@Body() filter: GeneralFilterDto, @Param('id') id: number) {
        return this.fleetService.generateFleetReport(filter, id);
    }
}