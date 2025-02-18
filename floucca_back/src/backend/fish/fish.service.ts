import {Injectable, NotFoundException} from "@nestjs/common";
import {FishInterface} from "./interface/fish.interface";
import {PrismaService} from "../../prisma/prisma.service";

@Injectable()
export class FishService {
    constructor(private prismaService: PrismaService) {
    }

    async getAllFish(): Promise<FishInterface[]> {
        return this.prismaService.fish.findMany();
    }

    async getFishById(fish_id: number): Promise<FishInterface> {
        const check = this.prismaService.fish.findUnique({
            where: {fish_id: fish_id}
        });
        if (!check) throw new NotFoundException("Fish not found");
        return check;
    }

    async createFish(fish: FishInterface): Promise<FishInterface> {
        return this.prismaService.fish.create({
            data: fish
        });
    }

    async updateFish(fish_id: number, fish: FishInterface): Promise<FishInterface> {
        const check = this.prismaService.fish.findUnique({
            where: {fish_id: fish_id}
        });
        if (!check) throw new NotFoundException("Fish not found");
        return this.prismaService.fish.update({
            where: {fish_id: fish_id},
            data: fish
        });
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
}