import {Injectable, NotFoundException} from "@nestjs/common";
import { GetAllGearUsageInterface} from "./interface"
import {CreateGearUsageDto, UpdateGearUsageDto} from "./dto"
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";

@Injectable()
export class GearUsageService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllGearUsage(): Promise<GetAllGearUsageInterface[]> {
        const gearUsage = await this.prisma.gear_usage.findMany();

        if (!gearUsage || gearUsage.length === 0) {
            throw new NotFoundException('No gear usage found');
        }

        return gearUsage;
    }

    async getGearUsageById(id: number): Promise<GetAllGearUsageInterface> {
        const gearUsage = await this.prisma.gear_usage.findUnique({
            where: {gear_usage_id: id}
        });

        if (!gearUsage) {
            throw new NotFoundException('No gear usage found');
        }

        return gearUsage;
    }

    async createGearUsage(gearUsage: CreateGearUsageDto): Promise<ResponseMessage<any>> {
        if(!await this.validate(gearUsage.fleet_senses_id, gearUsage.gear_code)){
            return {
                message: 'Fleet or gear not found'
            }
        }

        const newGearUsage = await this.prisma.gear_usage.create({
            data: {
                fleet_senses_id: gearUsage.fleet_senses_id,
                gear_code: gearUsage.gear_code,
                months: gearUsage.months
            }
        });

        return {
            message: 'Gear usage created successfully',
            data: newGearUsage
        };
    }

    async updateGearUsage(id: number, gearUsage: UpdateGearUsageDto): Promise<ResponseMessage<any>> {
        const checkGearUsage = await this.prisma.gear_usage.findUnique({
            where: {gear_usage_id: id}
        });

        if (!checkGearUsage) {
            return {
                message: 'Gear usage not found',
            };
        }

        if (!await this.validate(gearUsage.fleet_senses_id, gearUsage.gear_code)) {
            return {
                message: 'Fleet or gear not found'
            }
        }

        const updatedGearUsage = await this.prisma.gear_usage.update({
            where: {gear_usage_id: id},
            data: {
                fleet_senses_id: gearUsage.fleet_senses_id,
                gear_code: gearUsage.gear_code,
                months: gearUsage.months
            }
        });

        return {
            message: 'Gear usage updated successfully'
            ,
            data: updatedGearUsage
        };
    }

    async deleteGearUsage(id: number): Promise<ResponseMessage<any>> {
        const checkGearUsage = await this.prisma.gear_usage.findUnique({
            where: {gear_usage_id: id}
        });

        if (!checkGearUsage) {
            return {
                message: 'Gear usage not found',
            };
        }

        await this.prisma.gear_usage.delete({
            where: {gear_usage_id: id}
        });

    }

    async validate(fleet_senses_id: number, gear_code: number): Promise<boolean> {
        const checkFleet = await this.prisma.fleet_senses.findUnique({
            where: {fleet_senses_id: fleet_senses_id}
        });

        const checkGear = await this.prisma.gear.findUnique({
            where: {gear_code: gear_code}
        });

        return !(!checkFleet || !checkGear);

    }
}