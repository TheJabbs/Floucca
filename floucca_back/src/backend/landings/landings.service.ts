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
        let fishError = 0, gearError = 0, senseError = 0;

        let newPeriod = await this.prisma.period.findFirst({
            orderBy: { period_date: 'desc' }
        }) || await this.prisma.period.create({
            data: { period_date: new Date() },
            select: { period_date: true, period_status: true }
        });

        l.form.period_date = newPeriod.period_date;

        return await this.prisma.$transaction(async (prisma) => {
            const boatDetails = await prisma.boat_details.create({ data: l.boat_details });
            l.form.boat_detail = boatDetails.boat_id;

            const form = await prisma.form.create({ data: l.form });
            if (!form) throw new Error("Failed to create form data missing");

            l.landing.form_id = form.form_id;
            const landing = await prisma.landing.create({ data: l.landing });

            const [gears, species] = await Promise.all([
                prisma.gear.findMany({ select: { gear_code: true } }),
                prisma.specie.findMany({ select: { specie_code: true } })
            ]);

            let effort: any = null;
            if (l.effort) {
                l.effort.landing_id = landing.landing_id;
                effort = await prisma.effort_today.create({ data: l.effort });
            }

            if (l.gearDetail && effort) {
                const gearDetailsPromises = l.gearDetail.map(async (g) => {
                    if (gears.some(gear => gear.gear_code === g.gear_code)) {
                        g.effort_today_id = effort.effort_today_id;
                        return prisma.gear_details.create({ data: g });
                    } else {
                        gearError++;
                    }
                });
                await Promise.all(gearDetailsPromises);
            }

            if (l.fish) {
                const fishPromises = l.fish.map(async (f) => {
                    if (
                        species.some(specie => specie.specie_code === f.specie_code) &&
                        gears.some(gear => gear.gear_code === f.gear_code)
                    ) {
                        f.landing_id = landing.landing_id;
                        return prisma.fish.create({ data: f });
                    } else {
                        fishError++;
                    }
                });
                await Promise.all(fishPromises);
            }

            if (l.lastw) {
                const lastwPromises = l.lastw.map(async (s) => {
                    if (gears.some(gear => gear.gear_code === s.gear_code)) {
                        s.form_id = form.form_id;
                        return prisma.sense_lastw.create({ data: s });
                    } else {
                        senseError++;
                    }
                });
                await Promise.all(lastwPromises);
            }

            return {
                message: `Landing form created successfully. Errors - Fish: ${fishError}, Gear: ${gearError}, Sense: ${senseError}`,
                data: null
            };
        }).catch(async (error) => {
            // Cleanup if transaction fails
            await this.prisma.boat_details.delete({ where: { boat_id: l.form.boat_detail } });
            return { message: `Failed to create landing form: ${error.message}`, data: null };
        });
    }


    async getLandingsByFilter(filter: GeneralFilterDto): Promise<GetFilteredInterface[]>{
        const {
            period,
            gear_code,
            port_id,
            coop,
            region
        } = filter

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
                form: {
                    select:{
                        port_id: true
                    }
                },
                fish: {
                    select: {
                        specie_code: true,
                        fish_weight: true,
                        fish_quantity: true
                    }
                }
            }
        })

        // transform landings into GetFilteredInterface
        const landingsFiltered = landings.map(landing => {
            return {
                form_id: landing.form_id,
                port_id: landing.form.port_id,
                fish: landing.fish
            }
        })

        if(!landings || landings.length === 0){
            throw new NotFoundException('No landings found')
        }

        return landingsFiltered
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