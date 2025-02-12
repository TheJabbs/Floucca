import {Injectable, NotFoundException} from "@nestjs/common";
import {GetAllGearInterface} from "./interface/GetAllGear.interface";
import {CreateGearDto} from "./DTO/CreateGear.dto";
import {GearResponse} from "./interface/GearResponse.interface";
import Any = jasmine.Any;
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class GearService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllGear(): Promise<GetAllGearInterface[]> {
        const gear = await this.prisma.gear.findMany({
            select: {
                gear_code: true,
                gear_name: true,
                equipment_id: true,
                equipment_name: true,
            }
        });

        if (!gear || gear.length === 0) {
            throw new NotFoundException('No gear found');
        }

        return gear;
    }

    async getGearById(id: number): Promise<GetAllGearInterface> {
        const gear = await this.prisma.gear.findUnique({
            where: {gear_code: id},
            select: {
                gear_code: true,
                gear_name: true,
                equipment_id: true,
                equipment_name: true,
            }
        });

        if (!gear) {
            throw new NotFoundException('No gear found');
        }

        return gear;
    }

    async createGear(gear: CreateGearDto): Promise<GearResponse<any>> {
        const checkGear = await this.getGearById(gear.gear_code);
        if (checkGear) {
            return {
                message: 'Gear already exists',
                data: checkGear
            }
        }

        const newGear = await this.prisma.gear.create({
            data: gear,
        });

        return {
            message: 'Gear created successfully',
            data: newGear
        }

    }

    async updateGear(id: number, gear: CreateGearDto): Promise<GearResponse<Any>> {
        const checkGear = await this.getGearById(id);
        if (!checkGear) {
            return {
                message: 'Gear not found'
            }
        }

        const updatedGear = await this.prisma.gear.update({
            where: {gear_code: id},
            data: gear
        });

        return {
            message: 'Gear updated successfully',
        }
    }

    async deleteGear(id: number): Promise<GearResponse<Any>> {
        const checkGear = await this.getGearById(id);
        if (!checkGear) {
            return {
                message: 'Gear not found'
            }
        }

        await this.prisma.gear.delete({
            where: {gear_code: id}
        });

        return {
            message: 'Gear deleted successfully',
        }
    }


}