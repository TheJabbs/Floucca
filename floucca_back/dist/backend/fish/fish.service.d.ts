import { PrismaService } from "../../prisma/prisma.service";
import { CreateFishDto } from "./dto/create_fish.dto";
import { ResponseMessage } from "../../shared/interface/response.interface";
import { UpdateFishDto } from "./dto/update_fish.dto";
import { FishInterface } from "./interface/fish.interface";
export declare class FishService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getAllFish(): Promise<FishInterface[]>;
    getFishById(fish_id: number): Promise<FishInterface>;
    createFish(fish: CreateFishDto): Promise<ResponseMessage<any>>;
    updateFish(fish_id: number, fish: UpdateFishDto): Promise<ResponseMessage<any>>;
    deleteFish(fish_id: number): Promise<FishInterface>;
    getFishSpecieByGear(period: string, gear_code: number[]): Promise<number[]>;
    validate(d: any): Promise<boolean>;
}
