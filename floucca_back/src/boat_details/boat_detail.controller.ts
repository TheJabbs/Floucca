import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {BoatDetailService} from "./boat_detail.service";
import {mapBoatDetailToBoatDetailInterface} from "./mapper/boat_detail_interface.mapper";

@Controller('api/boatdetail')
export class BoatDetailController {
    constructor(private boatDetailService: BoatDetailService) {
    }

    @Get('/all')
    getAllBoatDetails() {
        return this.boatDetailService.getAllBoatDetails();
    }

    @Get('/:id')
    getBoatDetailById(@Param('id') id: number) {
        return this.boatDetailService.getBoatDetailById(id);
    }

    @Post('/create')
    createBoatDetail(@Body() boatDetail) {
        const check = this.boatDetailService.getBoatDetailById(boatDetail.boat_id);
        if (check) {
            return "Boat detail already exists"
        }
        return this.boatDetailService.createBoatDetail(mapBoatDetailToBoatDetailInterface(boatDetail));
    }

    @Put('/update/:id')
    updateBoatDetail(@Body() boatDetail, @Param('id') id: number) {
        const check = this.boatDetailService.getBoatDetailById(id);
        if (!check) {
            return "Boat detail does not exist"
        }
        return this.boatDetailService.updateBoatDetail(id, mapBoatDetailToBoatDetailInterface(boatDetail));
    }

    @Delete('/delete/:id')
    deleteBoatDetail(@Param('id') id: number) {
        const check = this.boatDetailService.getBoatDetailById(id);
        if (!check) {
            return "Boat detail does not exist"
        }
        return this.boatDetailService.deleteBoatDetail(id);
    }
}