import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {GetAllGearDetail} from "./interface/GetAllGearDetail.Interface";
import {CreateGearDetailDto} from "./DTO/CreateGearDetail.dto";
import {UpdateGearDetailDto} from "./dto/UpdateGearDetail.dto";
import {GearService} from "../gear/gear.service";
import {EffortTodayService} from "../effort_today/effort_today.service";

@Injectable()
export class GearDetailService {
    constructor(private readonly prisma: PrismaService,
                private readonly gearService: GearService,
                private readonly effortToday: EffortTodayService) {
    }

    async getAllGearDetail(): Promise<GetAllGearDetail[]> {
        const gear_detail = await this.prisma.gear_details.findMany();

        if (!gear_detail || gear_detail.length === 0) {
            throw new NotFoundException('No gear detail found');
        }

        return gear_detail;
    }

    async getGearDetailById(id: number): Promise<GetAllGearDetail> {
        const gear_detail = await this.prisma.gear_details.findUnique({
            where: {detail_id: id},
        });

        if (!gear_detail) {
            throw new NotFoundException('No gear detail found');
        }

        return gear_detail;
    }

    async createGearDetail(gear_detail: CreateGearDetailDto): Promise<ResponseMessage<any>> {
        const isValid = await this.validate(gear_detail);
        if (!isValid) {
            return {
                message: 'Invalid gear detail',
                data: null
            }
        }

        const newGearDetail = await this.prisma.gear_details.create({
            data: gear_detail,
        });

        return {
            message: 'Gear detail created',
            data: newGearDetail
        }
    }

    async deleteGearDetail(id: number): Promise<ResponseMessage<any>> {
        const gear_detail = await this.getGearDetailById(id);

        if (!gear_detail) {
            return {
                message: 'Gear detail not found',
                data: null
            }
        }

        await this.prisma.gear_details.delete({
            where: {detail_id: id}
        });

        return {
            message: 'Gear detail deleted',
            data: gear_detail
        }
    }

    async updateGearDetail(id: number, gear_detail: UpdateGearDetailDto): Promise<ResponseMessage<any>> {
        const checkGearDetail = await this.getGearDetailById(id);

        if (!checkGearDetail) {
            return {
                message: 'Gear detail not found',
                data: null
            }
        }

        const isValid = await this.validate(gear_detail);
        if (!isValid) {
            return {
                message: 'Invalid gear detail',
                data: null
            }
        }

        const updatedGearDetail = await this.prisma.gear_details.update({
            where: {detail_id: id},
            data: gear_detail
        });

        return {
            message: 'Gear detail updated',
            data: updatedGearDetail
        }
    }


    //------------------------------Validation--------------------------------------------------
    async validate(gear_detail: any): Promise<boolean> {
        if (gear_detail.gear_code) {
            const checkGearCode = await this.gearService.getGearById(gear_detail.gear_code);
            if (!checkGearCode) {
                return false;
            }
        }

        if (gear_detail.effort_today_id) {
            const checkEffortTodayId = await this.effortToday.getEffortTodayById(gear_detail.effort_today_id);
            if (!checkEffortTodayId) {
                return false;
            }
        }

        return true;
    }

}