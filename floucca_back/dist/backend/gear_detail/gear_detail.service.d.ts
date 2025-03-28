import { PrismaService } from "../../prisma/prisma.service";
import { ResponseMessage } from "../../shared/interface/response.interface";
import { GetAllGearDetail } from "./interface/GetAllGearDetail.Interface";
import { CreateGearDetailDto } from "./DTO/CreateGearDetail.dto";
import { UpdateGearDetailDto } from "./dto/UpdateGearDetail.dto";
import { GearService } from "../gear/gear.service";
import { EffortTodayService } from "../effort_today/effort_today.service";
export declare class GearDetailService {
    private readonly prisma;
    private readonly gearService;
    private readonly effortToday;
    constructor(prisma: PrismaService, gearService: GearService, effortToday: EffortTodayService);
    getAllGearDetail(): Promise<GetAllGearDetail[]>;
    getGearDetailById(id: number): Promise<GetAllGearDetail>;
    createGearDetail(gear_detail: CreateGearDetailDto): Promise<ResponseMessage<any>>;
    deleteGearDetail(id: number): Promise<ResponseMessage<any>>;
    updateGearDetail(id: number, gear_detail: UpdateGearDetailDto): Promise<ResponseMessage<any>>;
    validate(gear_detail: any): Promise<boolean>;
}
