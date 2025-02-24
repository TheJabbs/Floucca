import { Controller, Get, Post, Param, Delete, Body, Put } from "@nestjs/common";
import { SpecieService } from "./species.service";
import { CreateSpecieDto } from "./dto/create-species.dto";
import { Specie } from "./interfaces/species.interface";

@Controller("species")
export class SpecieController {
  constructor(private readonly specieService: SpecieService) {}

  @Post("create")
  async createSpecie(@Body() createSpecieDto: CreateSpecieDto): Promise<Specie> {
    return this.specieService.createSpecie(createSpecieDto);
  }
  
  @Get("all")
  async findAllSpecies(): Promise<Specie[]> {
    return this.specieService.findAllSpecies();
  }

  @Get(":specie_code")
  async findSpecieById(@Param("specie_code") specie_code: number): Promise<Specie | null> {
    return this.specieService.findSpecieById(Number(specie_code));
  }

  @Put("update/:specie_code")
  async updateSpecie(
    @Param("specie_code") specie_code: number, 
    @Body() updateSpecieDto: CreateSpecieDto
  ): Promise<Specie> {
    return this.specieService.updateSpecie(Number(specie_code), updateSpecieDto);
  }

  @Delete("delete/:specie_code")
  async deleteSpecie(@Param("specie_code") specie_code: number): Promise<Specie> {
    return this.specieService.deleteSpecie(Number(specie_code));
  }
}
