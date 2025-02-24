import { Injectable, ConflictException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { Region } from "./interfaces/region.interface";

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async validateRegion(region_code: number): Promise<boolean> {
    console.log(`Validating region with code: ${region_code}`);
    const region = await this.prisma.region.findUnique({
      where: { region_code },
    });
    return !!region;
  }

  async validateRegionData(createRegionDto: CreateRegionDto): Promise<void> {
    console.log("Validating region data:", createRegionDto);

    const existingRegion = await this.prisma.region.findUnique({
      where: { region_code: createRegionDto.region_code },
    });

    if (existingRegion) {
      throw new ConflictException(`Region with code ${createRegionDto.region_code} already exists.`);
    }
  }

  async createRegion(createRegionDto: CreateRegionDto): Promise<Region> {
    console.log("Creating region with data:", createRegionDto);

    await this.validateRegionData(createRegionDto); 

    return this.prisma.region.create({
      data: {
        region_code: createRegionDto.region_code, 
        region_name: createRegionDto.region_name,
      },
    });
  }

  async findAllRegions(): Promise<Region[]> {
    console.log("Fetching all regions...");
    return this.prisma.region.findMany();
  }

  async findRegionById(region_code: number): Promise<Region | null> {
    console.log(`Fetching region with ID: ${region_code}`);
    return this.prisma.region.findUnique({
      where: { region_code },
    });
  }

  async updateRegion(region_code: number, updateRegionDto: CreateRegionDto): Promise<Region> {
    console.log(`Updating region with ID: ${region_code} with data:`, updateRegionDto);

    const regionExists = await this.validateRegion(region_code);
    if (!regionExists) {
      throw new NotFoundException(`Region with code ${region_code} not found.`);
    }

    await this.validateRegionData(updateRegionDto); 

    return this.prisma.region.update({
      where: { region_code },
      data: updateRegionDto,
    });
  }

  async deleteRegion(region_code: number): Promise<Region> {
    console.log(`Deleting region with ID: ${region_code}`);

    const regionExists = await this.validateRegion(region_code);
    if (!regionExists) {
      throw new NotFoundException(`Region with code ${region_code} not found.`);
    }

    //  delete all associated coops
    await this.prisma.coop.deleteMany({
      where: { region_code },
    });

    // delete the region
    return this.prisma.region.delete({
      where: { region_code },
    });
  }
}
