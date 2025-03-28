import { PrismaService } from "../../prisma/prisma.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { Region } from "./interfaces/region.interface";
export declare class RegionService {
    private prisma;
    constructor(prisma: PrismaService);
    validateRegion(region_code: number): Promise<boolean>;
    validateRegionData(createRegionDto: CreateRegionDto): Promise<void>;
    createRegion(createRegionDto: CreateRegionDto): Promise<Region>;
    findAllRegions(): Promise<Region[]>;
    findRegionById(region_code: number): Promise<Region | null>;
    updateRegion(region_code: number, updateRegionDto: CreateRegionDto): Promise<Region>;
    deleteRegion(region_code: number): Promise<Region>;
}
