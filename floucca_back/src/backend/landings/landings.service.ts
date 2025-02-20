import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {GetAllLandingsInterface} from "./interface/getAllLandings.interface";
import {CreateLandingDto} from "./dto/createLandings.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {UpdateLandingsDto} from "./dto/updateLandings.dto";
import {CreateFormLandingDto} from "./dto/CreateFormLanding.dto";

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

    async createLandingForm(l :CreateFormLandingDto): Promise<ResponseMessage<any>> {
        const newPeriod = await this.prisma.period.findFirst({
            orderBy:{
                period_date: 'desc'
            }
        })

        if(!newPeriod){
            await this.prisma.period.create({
                data: {
                    period_date: new Date()
                }
            })
        }

        l.form.period_date = newPeriod.period_date;

        const form = await this.prisma.form.create({
            data: l.form
        })

        let fishError = 0;
        let gearError = 0;
        let senseError = 0;


        if(form){
            const boatDetails = await this.prisma.boat_details.create({
                data: l.boat_details
            })

            if(boatDetails){
                l.landing.form_id = form.form_id;
                l.landing.boat_details_id = boatDetails.boat_id;

                const landing = await this.prisma.landing.create({
                    data: l.landing
                })

                l.effort.landing_id = landing.landing_id;

                const effort = await this.prisma.effort_today.create({
                    data: l.effort
                })

                if(effort) {
                    for (const f of l.fish) {
                        f.landing_id = landing.landing_id;

                        const gear = await this.prisma.gear.findUnique({
                            where: {gear_code: f.gear_code}
                        })

                        const specie = await this.prisma.specie.findUnique({
                            where: {specie_code: f.specie_code}
                        })

                        if(gear && specie) {
                            await this.prisma.fish.create({
                                data: f
                            })
                        }else{
                            fishError++;
                        }
                    }

                    for (const l1 of l.lastw) {
                        l1.landing_id = landing.landing_id;

                        const gear = await this.prisma.gear.findUnique({
                            where: {gear_code: l1.gear_code}
                        })

                        if(gear) {
                            await this.prisma.sense_lastw.create({
                                data: l1
                            })
                        }else{
                            senseError++;
                        }
                    }

                    for (const g of l.gearDetail) {
                        g.effort_today_id = effort.effort_today_id;

                        const gear = await this.prisma.gear.findUnique({
                            where: {gear_code: g.gear_code}
                        })

                        if(gear) {
                            await this.prisma.gear_details.create({
                                data: g
                            })
                        }else{
                            gearError++;
                        }
                    }
                }else{
                    await this.prisma.landing.delete({
                        where: {landing_id: landing.landing_id}
                    })

                    await this.prisma.form.delete({
                        where: {form_id: form.form_id}
                    })
                }

            }else{
                // delete the creations
                await this.prisma.form.delete({
                    where: {form_id: form.form_id}
                })
            }
        }

        return {
            message: 'Form landing created: Fish error ' + fishError + " Sense error " + senseError + ' Gear error' + gearError,
            data: null
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