import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {CoopInterface} from "./interface/coop.interface";
import {mapCoopToReturnCoopInterface} from "./mapper/coop.mapper";

@Injectable()
export class CoopService {
    constructor(private readonly prisma: PrismaService) {
    }

async getAllCoops(): Promise<CoopInterface[]> {
    try {
        const coops = await this.prisma.coop.findMany();

        if (!coops)
            throw new NotFoundException("Coops not found");

        return coops.map((coop) => mapCoopToReturnCoopInterface(coop))
    } catch (error) {
        throw new Error(error);
    }
}

async getCoopById(coop_code: number): Promise<CoopInterface> {
    try {
        const coop = await this.prisma.coop.findUnique(
            {where: {coop_code: coop_code}}
        );

        if (!coop) {
            throw new NotFoundException("Coop for id " + coop_code + " not found.")
        }

        return mapCoopToReturnCoopInterface(coop);
    } catch (error) {
        throw new Error(error);
    }
}

async createCoop(coopToCreate: CoopInterface): Promise<CoopInterface> {
    try {
        const coop = await this.prisma.coop.findUnique({
            where: {coop_code: coopToCreate.coop_code},
        })

        if (coop)
            throw new NotFoundException("Coop already exists")

        const newCoop = await this.prisma.coop.create({
            data: {
                coop_code: coopToCreate.coop_code,
                region_code: coopToCreate.region_code,
                coop_name: coopToCreate.coop_name
            }
        })

        return mapCoopToReturnCoopInterface(newCoop);
    } catch (error) {
        throw new Error(error);
    }
}

async updateCoop(coop_code: number, coopToUpdate: CoopInterface): Promise<CoopInterface> {
    try {
        const coop = await this.prisma.coop.findUnique({
            where: {coop_code: coop_code},
        })

        if (!coop)
            throw new NotFoundException("Coop not found")

        const updatedCoop = await this.prisma.coop.update({
            where: {coop_code: coop_code},
            data: {
                coop_code: coopToUpdate.coop_code,
                region_code: coopToUpdate.region_code,
                coop_name: coopToUpdate.coop_name
            }
        })

        return mapCoopToReturnCoopInterface(updatedCoop);
    } catch (error) {
        throw new Error(error);
    }
}

async deleteCoop(coop_code: number): Promise<CoopInterface> {
    try {
        const coop = await this.prisma.coop.findUnique({
            where: {coop_code: coop_code},
        })

        if (!coop)
            throw new NotFoundException("Coop not found")

        await this.prisma.coop.delete({
            where: {coop_code: coop_code}
        })

        return mapCoopToReturnCoopInterface(coop);
    } catch (error) {
        throw new Error(error);
    }
}

}