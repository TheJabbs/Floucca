import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {FishService} from "./fish.service";

@Controller('/api/fish')
export class FishController {
    constructor(private fishService: FishService) {
    }

    @Get('/all')
    getAllFish() {
        return this.fishService.getAllFish();
    }

    @Get('/:id')
    getFishById(@Param('id') id: number) {
        return this.fishService.getFishById(id);
    }

    @Post('/create')
    createFish(@Body() fish) {
        return this.fishService.createFish(fish);
    }

    @Put('/update/:id')
    updateFish(@Body() fish, @Param('id') id: number) {
        return this.fishService.updateFish(id, fish);
    }

    @Delete('/delete/:id')
    deleteFish(@Param('id') id: number) {
        return this.fishService.deleteFish(id);
    }


}