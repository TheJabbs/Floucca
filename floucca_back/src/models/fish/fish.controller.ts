import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {FishService} from "./fish.service";
import {idDTO} from "../../shared/dto/id.dto";

@Controller('/api/fish')
export class FishController {
    constructor(private fishService: FishService) {
    }

    @Get('/all')
    getAllFish() {
        return this.fishService.getAllFish();
    }

    @Get('/:id')
    getFishById(@Param('id') id: idDTO) {
        return this.fishService.getFishById(id.id);
    }

    @Post('/create')
    createFish(@Body() fish) {
        return this.fishService.createFish(fish);
    }

    @Put('/update/:id')
    updateFish(@Body() fish, @Param('id') id: idDTO) {
        return this.fishService.updateFish(id.id, fish);
    }

    @Delete('/delete/:id')
    deleteFish(@Param('id') id: idDTO) {
        return this.fishService.deleteFish(id.id);
    }


}