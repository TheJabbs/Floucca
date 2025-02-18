import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {GetAllLandingsInterface} from "./interface/getAllLandings.interface";
import {CreateLandingDto} from "./dto/createLandings.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {UpdateLandingsDto} from "./dto/updateLandings.dto";

@Injectable()
export class LandingsService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllLandings()
    : Promise<GetAllLandingsInterface[]> {
        const landings = await this.prisma.landing.findMany();

        if (!landings || landings.length === 0) {
            throw new NotFoundException('No landings found');
        }

        return landings;
    }

    async getLandingById(id: number)
    : Promise<GetAllLandingsInterface> {
        const landing = await this.prisma.landing.findUnique({
            where: {landing_id: id},
        });

        if (!landing) {
            throw new NotFoundException('No landing found');
        }

        return landing;
    }

    async createLanding(landing: CreateLandingDto) : Promise<ResponseMessage<any>>{
        if(!await this.validate(landing)){
            const newLanding = await this.prisma.landing.create({
                data: landing,
            });
            return {
                message: 'Landing created',
                data: newLanding
            }
        }
    }

    async deleteLanding(id: number): Promise<ResponseMessage<any>> {
        const landing = await this.getLandingById(id);

        if (!landing) {
            return {
                message: 'Landing not found',
                data: null
            }
        }
    }

    async updateLanding(id: number, landing: UpdateLandingsDto): Promise<ResponseMessage<any>> {
        const checkLanding = await this.getLandingById(id);

        if (!checkLanding) {
            return {
                message: 'Landing not found',
                data: null
            }
        }

        if(!await this.validate(landing)) {
            const updatedLanding = await this.prisma.landing.update({
                where: {landing_id: id},
                data: landing,
            });
            return {
                message: 'Landing updated',
                data: updatedLanding
            }
        }
    }
    //===================================================================
    async validate(d: any): Promise<boolean> {
        if(d.form_id){
            const form = await this.prisma.form.findUnique({
                where: {form_id: d.form_id},
            })
            if(!form){
                return false;
            }
        }

        if(d.boat_details_id){
            const boat = await this.prisma.boat_details.findUnique({
                where: {boat_id: d.boat_details_id},
            })
            if(!boat){
                return false;
            }
        }
    }
}