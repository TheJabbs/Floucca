import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {BoatDetailInterface} from "./interface/boat_detail.interface";

@Injectable()
export class BoatDetailService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllBoatDetails(): Promise<BoatDetailInterface[]> {
        try {
            const boat_details = await this.prisma.boat_details.findMany();
            if (!boat_details)
                throw new NotFoundException("Boat details not found");
            return boat_details;
        } catch (error) {
            throw new Error(error);
        }
    }

    async getBoatDetailById(boat_id: number): Promise<BoatDetailInterface> {
        try {
            const boat_detail = await this.prisma.boat_details.findUnique(
                {where: {boat_id: boat_id}}
            );
            if (!boat_detail) {
                throw new NotFoundException("Boat detail not found.")
            }
            return boat_detail;
        } catch (error) {
            throw new Error(error);
        }
    }

    async createBoatDetail(boatDetail: BoatDetailInterface): Promise<BoatDetailInterface> {
        try {
            const boat_detail = await this.prisma.boat_details.findFirst({
                where: {
                    fleet_size: boatDetail.fleet_size,
                    fleet_registration: boatDetail.fleet_registration,
                    fleet_crew: boatDetail.fleet_crew,
                    fleet_max_weight: boatDetail.fleet_max_weigh,
                    fleet_length: boatDetail.fleet_length,
                    fleet_owner: boatDetail.fleet_owner
                }
            })

            if (boat_detail)
                throw new NotFoundException("Boat detail already exists")
            const newBoatDetail = await this.prisma.boat_details.create({
                data: {
                    fleet_size: boatDetail.fleet_size,
                    fleet_registration: boatDetail.fleet_registration,
                    fleet_crew: boatDetail.fleet_crew,
                    fleet_max_weight: boatDetail.fleet_max_weigh,
                    fleet_length: boatDetail.fleet_length,
                    fleet_owner: boatDetail.fleet_owner
                }
            })
            return newBoatDetail;
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateBoatDetail(boat_id: number, boatDetail: BoatDetailInterface): Promise<BoatDetailInterface> {
        try {
            const boat_detail = await this.prisma.boat_details.findUnique({
                where: {boat_id: boat_id},
            })

            if (!boat_detail)
                throw new NotFoundException("Boat detail not found")
            const updatedBoatDetail = await this.prisma.boat_details.update({
                where: {boat_id: boat_id},
                data: {
                    fleet_size: boatDetail.fleet_size,
                    fleet_registration: boatDetail.fleet_registration,
                    fleet_crew: boatDetail.fleet_crew,
                    fleet_max_weight: boatDetail.fleet_max_weigh,
                    fleet_length: boatDetail.fleet_length,
                    fleet_owner: boatDetail.fleet_owner
                }
            })
            return updatedBoatDetail;
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteBoatDetail(boat_id: number): Promise<BoatDetailInterface> {
        try {
            const boat_detail = await this.prisma.boat_details.findUnique({
                where: {boat_id: boat_id},
            })

            if (!boat_detail)
                throw new NotFoundException("Boat detail not found")
            const deletedBoatDetail = await this.prisma.boat_details.delete({
                where: {boat_id: boat_id}
            })
            return deletedBoatDetail;
        } catch (error) {
            throw new Error(error);
        }
    }
}