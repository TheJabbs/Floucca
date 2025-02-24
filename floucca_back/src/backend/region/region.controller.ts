// src/models/region/region.controller.ts
import { Controller, Get, Post, Param, Delete, Body, Put } from "@nestjs/common";
import { RegionService } from "./region.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { idDTO } from "../../shared/dto/id.dto";
import { Region } from "./interfaces/region.interface";

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

  @Get(":id")
  async findRegionById(@Param() params: idDTO): Promise<Region | null> {
    return this.regionService.findRegionById(params.id);
  }

  @Put("update/:id")
  async updateRegion(@Param() params: idDTO, @Body() updateRegionDto: CreateRegionDto): Promise<Region> {
    return this.regionService.updateRegion(params.id, updateRegionDto);
  }

  @Delete("delete/:id")
  async deleteRegion(@Param() params: idDTO): Promise<Region> {
    return this.regionService.deleteRegion(params.id);
  }
}
