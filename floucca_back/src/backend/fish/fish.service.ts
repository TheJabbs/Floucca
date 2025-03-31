import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {CreateFishDto} from "./dto/create_fish.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {UpdateFishDto} from "./dto/update_fish.dto";
import {FishInterface} from "./interface/fish.interface";
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";
import {idDTO} from "../../shared/dto/id.dto";

@Injectable()
export class FishService {
    constructor(private prismaService: PrismaService) {
    }

    async getAllFish(): Promise<FishInterface[]> {
        const fish = await this.prismaService.fish.findMany();
        if (!fish || fish.length === 0) {
            throw new NotFoundException("No fish records found");
        }
        return fish;
    }

    async getFishById(fish_id: number): Promise<FishInterface> {
        const check = this.prismaService.fish.findUnique({
            where: {fish_id: fish_id}
        });
        if (!check) throw new NotFoundException("Fish not found");
        return check;
    }

    async createFish(fish: CreateFishDto): Promise<ResponseMessage<any>> {
        if (await this.validate(fish)) {
            const newFish = await this.prismaService.fish.create({
                data: fish
            });
            return {
                message: "Fish created successfully",
                data: newFish
            }
        }
    }

    async updateFish(fish_id: number, fish: UpdateFishDto): Promise<ResponseMessage<any>> {
        const check = this.prismaService.fish.findUnique({
            where: {fish_id: fish_id}
        });

        if (!check) throw new NotFoundException("Fish not found");

        if (await this.validate(fish)) {
            const updatedFish = await this.prismaService.fish.update({
                where: {fish_id: fish_id},
                data: fish
            });
            return {
                message: "Fish updated successfully",
                data: updatedFish
            }
        }
    }

    async deleteFish(fish_id: number): Promise<FishInterface> {
        const check = this.prismaService.fish.findUnique({
            where: {fish_id: fish_id}
        });
        if (!check) throw new NotFoundException("Fish not found");
        return this.prismaService.fish.delete({
            where: {fish_id: fish_id}
        });
    }

    async getFishSpecieByGear(filter: GeneralFilterDto): Promise<number[]> {
        const species = await this.prismaService.fish.findMany({
            distinct: ['specie_code'],
            where: {
                gear_code: {in: filter.gear_code},
                landing:{
                    form:{
                        period_date: filter.period,
                        port_id: filter.port_id ? {in: filter.port_id} : undefined,
                        ports: {
                            coop_code: filter.coop ? {in: filter.coop} : undefined,
                            coop: {
                                region_code: filter.region ? {in: filter.region} : undefined
                            }
                        }
                    }
                }
            },
            select: {specie_code: true}
        });

        return species.map(specie => specie.specie_code);
    }


    //===============================================
    async validate(d: any): Promise<boolean> {
        if (d.specie_code) {
            const check = await this.prismaService.specie.findUnique({
                where: {specie_code: d.specie_code}
            })

            if (!check) return false;
        }

        if (d.landing_id) {
            const check = await this.prismaService.landing.findUnique({
                where: {landing_id: d.landing_id}
            })

            if (!check) return false;
        }

        if (d.gear_code) {
            const check = await this.prismaService.gear.findUnique({
                where: {gear_code: d.gear_code}
            })

            if (!check) return false;
        }

        return true;
    }
}