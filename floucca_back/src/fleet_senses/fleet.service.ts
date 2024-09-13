import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {GetAllFleetInterface} from "./Interface/GetAllFleetInterface";
import {CreateFleetDto} from "./DTO/CreateFleet.dto";
import {FleetResponse} from "./Interface/FleetResponse.interface";
import {FleetIdDto} from "./DTO/FleetId.dto";

@Injectable()
export class FleetService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllFleet(): Promise<GetAllFleetInterface[]> {
        const fleet = await this.prisma.fleet_senses.findMany({
                select: {
                    fleet_senses_id: true,
                    boat_details_id: true,
                    form_id: true,
                    gear_usage: {
                        select: {
                            gear_code: true,
                            months: true
                        }
                    }
                }
            }
        );

        if (!fleet || fleet.length === 0) {
            throw new NotFoundException('No fleet senses found');
        }

        return fleet;
    }

    async getFleetById(id: number): Promise<GetAllFleetInterface> {
        const fleet = await this.prisma.fleet_senses.findUnique({
            where: {fleet_senses_id: id},
            select: {
                fleet_senses_id: true,
                boat_details_id: true,
                form_id: true,
                gear_usage: {
                    select: {
                        gear_code: true,
                        months: true,
                    }
                }
            }
        });

        if (!fleet) {
            throw new NotFoundException('No fleet senses found');
        }

        return fleet;
    }

    async createFleet(fleet: CreateFleetDto): Promise<FleetResponse<any>> {
        if (!await this.validate(fleet.form_id, fleet.boat_details_id)) {
            return {
                message: "Form or boat details not found"
            }
        }

        const newFleet = await this.prisma.fleet_senses.create({
            data: {
                boat_details_id: fleet.boat_details_id,
                form_id: fleet.form_id
            }
        });

        return {
            message: "Fleet created",
        }

    }

    async updateFleet(id: number, fleet: CreateFleetDto): Promise<FleetResponse<any>> {
        if (!await this.validate(fleet.form_id, fleet.boat_details_id)) {
            return {
                message: "Form or boat details not found"
            }
        }

        const updatedFleet = await this.prisma.fleet_senses.update({
            where: {fleet_senses_id: id},
            data: {
                boat_details_id: fleet.boat_details_id,
                form_id: fleet.form_id
            }
        });
    }

    async deleteFleet(id: number): Promise<FleetResponse<any>> {
        const check = await this.prisma.fleet_senses.findUnique({
            where: {fleet_senses_id: id}
        });

        if (!check) {
            return {
                message: "Fleet not found"
            }
        }
        return {
            message: "Fleet deleted",
        }
    }



//Validate
    async validate(form_id: number, boat_details_id: number): Promise<boolean> {
        const form = await this.prisma.form.findFirst({
            where: {
                form_id: form_id
            }
        })

        const boat = await this.prisma.boat_details.findFirst({
            where: {
                boat_id: boat_details_id
            }
        })

        return !(!form || !boat);

    }


}
;