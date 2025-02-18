import {Body, Controller, Delete, Get, Param, Post, Put} from "@nestjs/common";
import {CoopService} from "./coop.service";
import {CoopDto} from "./dto/coop.Dto";
import {mapCoopToReturnCoopInterface} from "./mapper/coop.mapper";
import {idDTO} from "../../shared/dto/id.dto";

@Controller('api/coop')
export class CoopController {
    constructor(private coopService: CoopService) {
    }

    @Get('/all')
    getAllCoops() {
        return this.coopService.getAllCoops();
    }

    @Get('/:id')
    getCoopById(@Param('id') id: idDTO) {
        return this.coopService.getCoopById(id.id);
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
    updateCoop(@Body() coop : CoopDto, @Param('id') id: idDTO){
        const check = this.coopService.getCoopById(id.id);
        if (!check){
            return "Coop does not exist"
        }
        return this.coopService.updateCoop(id.id,mapCoopToReturnCoopInterface(coop));
    }

    @Delete('/delete/:id')
    deleteCoop(@Param('id') id: idDTO){
        const check = this.coopService.getCoopById(id.id);
        if (!check){
            return "Coop does not exist"
        }
        return this.coopService.deleteCoop(id.id);
    }


}