import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BoatDetailsServices } from './boat_detail.service';
import { CreateBoatDetailsDto } from './dto';
import {idDTO} from "../../shared/dto/id.dto";

@Controller('api/dev/boat_details')
export class BoatDetailsController {
  constructor(private readonly boatDetailsService: BoatDetailsServices) {}

  @Get('/all/boat_details')
  getAllBoatDetails() {
    return this.boatDetailsService.getAllBoatDetails();
  }

  @Get('/boat_details/:boat_details_id')
  getBoatDetailsByBDID(@Param('boat_details_id', ) BDID: idDTO) {
    console.log(BDID);
    return this.boatDetailsService.getBoatDetailsByBDID(BDID.id);
  }

  //   @Get('/boat/fleet_owner/:fleet_owner')  to be revised

  @Post('/create/boat_details')
  createBoatDetails(@Body() newBoatDetails: CreateBoatDetailsDto) {
    return this.boatDetailsService.createBoatDetails(newBoatDetails);
  }

  @Delete('/delete/boat_details/:boat_details_id')
  deleteBoatDetails(@Param('boat_details_id') BDID: idDTO) {
    return this.boatDetailsService.deleteBoatDetails(BDID.id);
  }
}
