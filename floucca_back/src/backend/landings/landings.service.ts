import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {GetAllLandingsInterface} from "./interface/getAllLandings.interface";
import {CreateLandingDto} from "./dto/createLandings.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {UpdateLandingsDto} from "./dto/updateLandings.dto";
import {CreateFormLandingDto} from "./dto/CreateFormLanding.dto";
import {GeneralFilterDto} from "../../shared/dto/GeneralFilter.dto";
import {GetFilteredInterface} from "./interface/getFiltered.interface";

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

    async createLanding(landing: CreateLandingDto): Promise<ResponseMessage<any>> {
        if (!await this.validate(landing)) {
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

        if (!await this.validate(landing)) {
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

    async createLandingForm(l: CreateFormLandingDto): Promise<ResponseMessage<any>> {

        let fishError: number = 0;
        let gearError: number = 0;
        let senseError: number = 0;

        let newPeriod = await this.prisma.period.findFirst({
            orderBy: {
                period_date: 'desc'
            }
        })

        if (!newPeriod) {
            newPeriod = await this.prisma.period.create({
                data: {
                    period_date: new Date()
                },
                select: {
                    period_date: true,
                    period_status: true
                }
            });
        }

        l.form.period_date = newPeriod.period_date;

        const boatDetails = await this.prisma.boat_details.create({
            data: l.boat_details
        })

        if (boatDetails) {
            l.form.boat_detail = boatDetails.boat_id
            const form = await this.prisma.form.create({
                data: l.form
            })

            if (form) {
                l.landing.form_id = form.form_id
                const landing = await this.prisma.landing.create({
                    data: l.landing
                })

                if (l.effort && landing) {
                    l.effort.landing_id = landing.landing_id
                    const effort = await this.prisma.effort_today.create({
                        data: l.effort
                    })

                    for (const g of l.gearDetail) {
                        const gear = await this.prisma.gear.findUnique({
                            where: {
                                gear_code: g.gear_code
                            }
                        })

                        if (gear) {
                            g.effort_today_id = effort.effort_today_id
                            await this.prisma.gear_details.create({
                                data: g
                            })
                        }else{
                            gearError++;
                        }
                    }

                    for (const f of l.fish) {
                        const specie = await this.prisma.specie.findUnique({
                            where: {
                                specie_code: f.specie_code
                            }
                        })

                        const gear = await this.prisma.gear.findUnique({
                            where: {
                                gear_code: f.gear_code
                            }
                        })


                        if (specie && gear) {
                            f.landing_id = landing.landing_id
                            await this.prisma.fish.create({
                                data: f
                            })
                        }else{
                            fishError++;
                        }
                    }
                }

                if (l.lastw) {
                    for (const s of l.lastw) {
                        const gear = await this.prisma.gear.findUnique({
                            where: {
                                gear_code: s.gear_code
                            }
                        })

                        if (gear) {
                            s.form_id = form.form_id
                            await this.prisma.sense_lastw.create({
                                data: s
                            })
                        }else{
                            senseError++;
                        }
                    }
                }

            } else {
                await this.prisma.boat_details.delete({
                    where: {
                        boat_id: boatDetails.boat_id
                    }
                })
            }
        } else {
            await this.prisma.boat_details.delete({
                where: {
                    boat_id: boatDetails.boat_id
                }
            })
        }

        return {
            message: 'Landing form created successfully. Errors: Fish: ' + fishError + ' Gear: ' + gearError + ' Sense: ' + senseError,
            data: null
        }

    }

    async getLandingsByFilter(filter: GeneralFilterDto): Promise<GetFilteredInterface[]>{
        const {
            period,
            gear_code,
            port_id,
            coop,
            region
        }= filter

        // With this design I am giving the user the option to filter not only by port, but also by region and coop
        if(!port_id && !region && !coop) {
            throw new NotFoundException('No port, region or coop found');
        }

        const landings = await this.prisma.landing.findMany({
            distinct: ['form_id'],
            where: {
                form: {
                    period_date: period,
                    port_id: port_id ? {in: port_id} : undefined,
                    ports: {
                        coop_code: coop ? {in: coop} : undefined,
                        coop: {
                            region_code: region ? {in: region} : undefined
                        }
                    }
                },

                fish: {
                    some: {
                        gear_code: gear_code ? {in: gear_code} : undefined
                    }
                }
            },

            select: {
                form_id: true,
                fish: {
                    select: {
                        specie_code: true,
                        fish_weight: true,
                        fish_quantity: true
                    }
                }
            }
        })

        if(!landings || landings.length === 0){
            throw new NotFoundException('No landings found')
        }

        return landings
    }


//===================================================================
    async validate(d: any): Promise<boolean> {
        if (d.form_id) {
            const form = await this.prisma.form.findUnique({
                where: {form_id: d.form_id},
            })
            if (!form) {
                return false;
            }
        }
    }
}