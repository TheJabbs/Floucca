import { RegionService } from "./region.service";
import { CreateRegionDto } from "./dto/create-region.dto";
import { Region } from "./interfaces/region.interface";
export declare class RegionController {
    private readonly regionService;
    constructor(regionService: RegionService);
    createRegion(createRegionDto: CreateRegionDto): Promise<Region>;
    findAllRegions(): Promise<Region[]>;
    findRegionById(region_code: number): Promise<Region | null>;
    updateRegion(region_code: number, updateRegionDto: CreateRegionDto): Promise<Region>;
    deleteRegion(region_code: number): Promise<Region>;
}
