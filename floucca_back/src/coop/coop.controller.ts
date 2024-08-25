import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CoopService} from "./coop.service";
import {CoopDto} from "./coopDto/coop.Dto";
import {mapCoopToReturnCoopInterface} from "./mapper/coop.mapper";

@Controller('api/coop')
export class CoopController {
    constructor(private coopService: CoopService) {
    }

    @Get('/all')
    getAllCoops() {
        return this.coopService.getAllCoops();
    }

    @Get('/:id')
    getCoopById(@Param('id') id: number) {
        return this.coopService.getCoopById(id);
    }

    @Post('/create')
    createCoop(@Body () coop : CoopDto){
        const check = this.coopService.getCoopById(coop.coop_code);
        if (check){
            return "Coop already exists"
        }

        return this.coopService.createCoop(mapCoopToReturnCoopInterface(coop));

    }

    @Put('/update/:id')
    updateCoop(@Body() coop : CoopDto, @Param('id') id: number){
        const check = this.coopService.getCoopById(id);
        if (!check){
            return "Coop does not exist"
        }
        return this.coopService.updateCoop(id,mapCoopToReturnCoopInterface(coop));
    }

    @Delete('/delete/:id')
    deleteCoop(@Param('id') id: number){
        const check = this.coopService.getCoopById(id);
        if (!check){
            return "Coop does not exist"
        }
        return this.coopService.deleteCoop(id);
    }


}