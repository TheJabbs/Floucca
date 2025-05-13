import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {GetAllLandingsInterface} from "./interface/get_all_landings.interface";
import {CreateLandingDto} from "./dto/create_landings.dto";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {UpdateLandingsDto} from "./dto/update_landings.dto";
import {CreateFormLandingDto} from "./dto/create_form_landing.dto";
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";
import {GetFilteredInterface} from "./interface/get_filtered.interface";
import {filterToFilteredInterfaceMapper} from "../fish/mapper/filter_to_filtered_interface.mapper";
import {FormGateway} from "../form/form.gateWay";
import {GetCoordinatesInterface} from "./interface/getCoordinates.interface";
import {PrismaPromise} from "@prisma/client";
import {Decimal} from "@prisma/client/runtime/library";

@Injectable()
export class LandingsService {
    constructor(private readonly prisma: PrismaService,
                private readonly formGateway: FormGateway) {
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

    async createLandingForm(data: CreateFormLandingDto): Promise<ResponseMessage<any>> {
        let fishError = 0, gearError = 0, senseError = 0;

        let newPeriod = await this.prisma.period.findFirst({
            orderBy: {period_date: 'desc'}
        }) || await this.prisma.period.create({
            data: {period_date: new Date()},
            select: {period_date: true, period_status: true}
        });

        console.log("newestPeriod", newPeriod.period_date);

        data.form.period_date = newPeriod.period_date.toISOString();

        const boatDetails = await this.prisma.boat_details.create({data: data.boat_details});
        data.form.boat_detail = boatDetails.boat_id;
        let form;

        await this.prisma.$transaction(async (prisma) => {
             form = await prisma.form.create({data: data.form});
            if (!form) throw new Error("Failed to create form data missing");

            let landing: any = null;
            if (data.landing) {
                data.landing.form_id = form.form_id;
                landing = await prisma.landing.create({data: data.landing});
            }

            const [gears, species] = await Promise.all([
                prisma.gear.findMany({select: {gear_code: true}}),
                prisma.specie.findMany({select: {specie_code: true}})
            ]);

            let effort: any = null;
            if (data.effort && landing) {
                data.effort.landing_id = landing.landing_id;
                effort = await prisma.effort_today.create({data: data.effort});
            }

            if (data.gearDetail && effort) {
                const gearDetailsPromises = data.gearDetail.map(async (g) => {
                    if (gears.some(gear => gear.gear_code === g.gear_code)) {
                        g.effort_today_id = effort.effort_today_id;
                        return prisma.gear_details.create({data: g});
                    } else {
                        gearError++;
                    }
                });
                await Promise.all(gearDetailsPromises);
            }

            if (data.fish && landing) {
                const fishPromises = data.fish.map(async (f) => {
                    if (
                        species.some(specie => specie.specie_code === f.specie_code) &&
                        gears.some(gear => gear.gear_code === f.gear_code)
                    ) {
                        f.landing_id = landing.landing_id;
                        return prisma.fish.create({data: f});
                    } else {
                        fishError++;
                    }
                });
                await Promise.all(fishPromises);
            }

            if (data.lastw) {
                const lastwPromises = data.lastw.map(async (s) => {
                    if (gears.some(gear => gear.gear_code === s.gear_code)) {
                        s.form_id = form.form_id;
                        return prisma.sense_lastw.create({data: s});
                    } else {
                        senseError++;
                    }
                });
                await Promise.all(lastwPromises);
            }


        }).catch(async (error) => {
            // Cleanup if transaction fails
            await this.prisma.boat_details.delete({where: {boat_id: boatDetails.boat_id}});
            return {message: `Failed to create landing form: ${error.message}`, data: null};
        });

        const newForm = await this.prisma.form.findUnique({where: {form_id: form.form_id}, include: {users: true}});
        this.formGateway.notifyNewForm(newForm);


        return {
            message: `Landing form created successfully. Errors - Fish: ${fishError}, Gear: ${gearError}, Sense: ${senseError}`,
            data: null
        };
    }


    async getLandingsByFilter(filter: GeneralFilterDto, user?: number): Promise<GetFilteredInterface[]> {
        const {
            period,
            gear_code,
            port_id,
            coop,
            region,
            specie_code
        } = filter

        // With this design I am giving the user the option to filter not only by port, but also by region and coop
        if (!port_id && !region && !coop) {
            throw new NotFoundException('No port, region or coop found');
        }

        const landings = await this.prisma.landing.findMany({
            where: {
                form: {
                    users: {
                        user_id: user ? {in: [user]} : undefined
                    },
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
                        gear_code: gear_code ? {in: gear_code} : undefined,
                        specie_code: specie_code ? {in: specie_code} : undefined
                    }
                }
            },

            select: {
                form: {
                    select: {
                        port_id: true,
                        form_id: true,
                    }
                },
                fish: {
                    select: {
                        specie_code: true,
                        fish_weight: true,
                        fish_quantity: true,
                        fish_length: true,
                        gear_code: true,
                        price: true,
                        specie: {
                            select: {
                                specie_name: true
                            }
                        }
                    }
                }
            }
        })

        if (!landings || landings.length === 0) {
            throw new NotFoundException('No landings found');
        }

        return filterToFilteredInterfaceMapper(landings);
    }

    async getCoordinates(filter: GeneralFilterDto): Promise<GetCoordinatesInterface[]> {
        const promises: PrismaPromise<{ landing: { longitude: Decimal; latitude: Decimal } }[]>[] = [];
        const answer: GetCoordinatesInterface[] = [];

        filter.specie_code.forEach(specie => {
            answer.push({
                landing: [],
                specie_code: specie,
            });

            promises.push(
                this.prisma.fish.findMany({
                    where: {
                        landing: {
                            form: {
                                period_date: filter.period ? filter.period : undefined,
                                port_id: filter.port_id ? {in: filter.port_id} : undefined,
                                ports: {
                                    coop_code: filter.coop ? {in: filter.coop} : undefined,
                                    coop: {
                                        region_code: filter.region ? {in: filter.region} : undefined
                                    }
                                }
                            }
                        },
                        specie_code: specie
                    },
                    select: {
                        landing: {
                            select: {
                                longitude: true,
                                latitude: true
                            }
                        }
                    }
                })
            );
        });

        const data = await Promise.all(promises);

        data.forEach((entries, index) => {
            entries.forEach(entry => {
                answer[index].landing.push({
                    longitude: entry.landing.longitude.toNumber(),
                    latitude: entry.landing.latitude.toNumber(),
                });
            });
        });

        return answer;
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