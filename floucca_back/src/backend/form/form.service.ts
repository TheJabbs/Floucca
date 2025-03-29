import {Injectable, NotFoundException} from "@nestjs/common";
import {CreateFormDto} from "./dto/create_form.dto";
import {GetAllFormInterface} from './interface/index'
import {UpdateFormDto} from "./dto/update_form.dto";
import {PrismaService} from "../../prisma/prisma.service";
import {ResponseMessage} from "../../shared/interface/response.interface";
import {GetTopFormsInterface} from "./interface/index";

@Injectable()
export class FormService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllForms(): Promise<GetAllFormInterface[]> {
        const form = await this.prisma.form.findMany();

        if (!form || form.length === 0) {
            throw new NotFoundException('No forms found');
        }

        return form;
    }

    async getTopFormsByUser(user_id: number): Promise<GetTopFormsInterface[]> {
        const forms = await this.prisma.form.findMany({
            where: {user_id},
            take: 20,
            orderBy: {creation_time: "desc"},
            select: {
                form_id: true,
                port_id: true,
                user_id: true,
                fisher_name: true,
                period_date: true,
                boat_detail: true,
                creation_time: true,

                ports: {select: {port_name: true}},
                boat_details: {
                    select: {
                        fleet_owner: true,
                        fleet_registration: true,
                        fleet_hp: true,
                        fleet_crew: true,
                        fleet_max_weight: true,
                        fleet_length: true,
                    },
                },

                landing: {
                    select: {
                        longitude: true,
                        latitude: true,
                        fish: {
                            select: {
                                specie_code: true,
                                gear_code: true,
                                fish_weight: true,
                                fish_length: true,
                                fish_quantity: true,
                            },
                        },
                        effort_today: {
                            select: {
                                hours_fished: true,
                                gear_details: {
                                    select: {
                                        gear_code: true,
                                        detail_name: true,
                                        detail_value: true,
                                    },
                                },
                            },
                        },
                    },
                },

                sense_lastw: {
                    select: {
                        gear_code: true,
                        days_fished: true,
                    },
                },
            },
        });

        return forms.map((form) => ({
            form: {
                form_id: form.form_id,
                user_id: form.user_id,
                port_id: form.port_id,
                fisher_name: form.fisher_name,
                period_date: form.period_date,
                boat_detail: form.boat_detail,
                creation_time: form.creation_time,

            },

            ports: form.ports,
            boat_details: form.boat_details,

            landing: form.landing.length > 0
                ? {
                    latitude: form.landing[0].latitude.toNumber(),
                    longitude: form.landing[0].longitude.toNumber(),
                }
                : undefined,

            fish: form.landing.length > 0 && form.landing[0].fish
                ? form.landing[0].fish
                : [],

            effort: form.landing.length > 0 && form.landing[0].effort_today.length > 0
                ? {
                    hours_fished: form.landing[0].effort_today[0].hours_fished,
                }
                : undefined,

            gearDetail: form.landing.length > 0 &&
            form.landing[0].effort_today.length > 0 &&
            form.landing[0].effort_today[0].gear_details
                ? form.landing[0].effort_today[0].gear_details
                : [],

            lastw: form.sense_lastw.length > 0 ? form.sense_lastw : [],
        }));
    }


    async getFormById(id: number): Promise<GetAllFormInterface> {
        const form = await this.prisma.form.findUnique({
            where: {form_id: id}
        });

        if (!form) {
            throw new NotFoundException('No form found');
        }

        return form;
    }

    async createForm(form: CreateFormDto): Promise<ResponseMessage<any>> {
        if (!await this.validate(form.user_id, form.port_id)) {
            return {
                message: 'User or port not found'
            }
        }

        const newForm = await this.prisma.form.create({
            data: form
        });

        return {
            message: 'Form created successfully',
            data: newForm
        }
    }

    async deleteForm(id: number): Promise<ResponseMessage<any>> {

        const check = await this.prisma.form.findUnique({
            where: {form_id: id}
        });

        if (!check) {
            return {
                message: 'Form not found'

            }
        }

        const form = await this.prisma.form.delete({
            where: {form_id: id}
        });

        return {
            message: 'Form deleted successfully',
            data: form
        }
    }

    async updateForm(id: number, form: UpdateFormDto): Promise<ResponseMessage<any>> {
        const check = await this.prisma.form.findUnique({
            where: {form_id: id}
        });

        if (!check) {
            return {
                message: 'Form not found'
            }
        }

        if (!await this.validate(form.user_id, form.port_id)) {
            return {
                message: 'User or port not found'
            }
        }

        const updatedForm = await this.prisma.form.update({
            where: {form_id: id},
            data: {
                user_id: form.user_id,
                port_id: form.port_id,
                period_date: form.period_date,
                fisher_name: form.fisher_name
            }
        });

        return {
            message: 'Form updated successfully',
            data: updatedForm
        }
    }


    async validate(user_id?: number, port_id?: number): Promise<boolean> {
        const user = user_id ? await this.prisma.users.findFirst({
            where: {user_id: user_id}
        }) : null;

        const port = port_id ? await this.prisma.ports.findFirst({
            where: {port_id: port_id}
        }) : null;

        const period = await this.prisma.period.findFirst({
            where: {period_date: new Date()}
        })

        return !!user || !!port || period.period_status === "B";
    }


}