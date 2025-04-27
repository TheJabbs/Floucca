import { Controller, Get, Post, Param, Delete, Body, Put } from "@nestjs/common";
import { RegionService } from "./region.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { Region } from "./interfaces/region.interface";
import { UpdateRegionDto } from "./dto/update-region.dto"; 

@Controller("region")
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post("create")
  async createRegion(@Body() createRegionDto: CreateRegionDto): Promise<Region> {
    return this.regionService.createRegion(createRegionDto);
  }

  @Get("all")
  async findAllRegions(): Promise<Region[]> {
    return this.regionService.findAllRegions();
  }

  @Get(":region_code") 
  async findRegionById(@Param("region_code") region_code: number): Promise<Region | null> {
    console.log("Fetching region with code:", region_code);
    return this.regionService.findRegionById(region_code);
  }

 
@Put("update/:region_code") 
async updateRegion(
  @Param("region_code") region_code: number,
  @Body() updateRegionDto: UpdateRegionDto
): Promise<Region> {
  console.log(`Updating region ${region_code} with data:`, updateRegionDto);
  return this.regionService.updateRegion(region_code, updateRegionDto);
}

  @Delete("delete/:region_code") 
  async deleteRegion(@Param("region_code") region_code: number): Promise<Region> {
    console.log("Received request to delete region with code:", region_code);
    return this.regionService.deleteRegion(region_code);
  }
}
