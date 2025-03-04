import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {ResponseMessage} from '../../shared/interface/response.interface';
import {GetAllSenseLastw} from './interface/getAllSense_lastw.interface';
import {CreateSenseLastwDto} from './dto/create-sense_lastw.dto';
import {UpdateSenseLastwDto} from './dto/update-sense_lastw.dto';
import {GeneralFilterDto} from "../../shared/dto/GeneralFilter.dto";
import {GetFilteredLastWInterface} from "./interface/getFilteredLastW.interface";

@Injectable()
export class SenseLastwService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getAllSenseLastw(): Promise<GetAllSenseLastw[]> {
        const sense_lastw = await this.prisma.sense_lastw.findMany();

        if (!sense_lastw || sense_lastw.length === 0) {
            throw new NotFoundException('No sense_lastw records found');
        }

        return sense_lastw;
    }

    async getSenseLastwById(id: number): Promise<GetAllSenseLastw> {
        const sense_lastw = await this.prisma.sense_lastw.findUnique({
            where: {sense_lastW_id: id},
        });

        if (!sense_lastw) {
            throw new NotFoundException('Sense lastw record not found');
        }

        return sense_lastw;
    }

    async createSenseLastw(sense_lastw: CreateSenseLastwDto): Promise<ResponseMessage<any>> {
        if (sense_lastw.form_id || sense_lastw.gear_code) {
            if (!await this.validate(sense_lastw)) {
                const newSenseLastw = await this.prisma.sense_lastw.create({
                    data: sense_lastw,
                });
                return {
                    message: 'Sense lastw record created successfully',
                    data: newSenseLastw,
                };
            }
        }

        return {
            message: 'Invalid sense lastw record',
            data: null,
        }


    }

    async deleteSenseLastw(id: number): Promise<ResponseMessage<any>> {
        const sense_lastw = await this.getSenseLastwById(id);

        if (!sense_lastw) {
            return {
                message: 'Sense lastw record not found',
                data: null,
            };
        }

        await this.prisma.sense_lastw.delete({
            where: {sense_lastW_id: id},
        });

        return {
            message: 'Sense lastw record deleted successfully',
            data: sense_lastw,
        };
    }

    async updateSenseLastw(id: number, sense_lastw: UpdateSenseLastwDto): Promise<ResponseMessage<any>> {
        const checkSenseLastw = await this.getSenseLastwById(id);

        if (!checkSenseLastw) {
            return {
                message: 'Sense lastw record not found',
                data: null,
            };
        }
        if (!await this.validate(sense_lastw)) {
            const updatedSenseLastw = await this.prisma.sense_lastw.update({
                where: {sense_lastW_id: id},
                data: sense_lastw,
            });

            return {
                message: 'Sense lastw record updated successfully',
                data: updatedSenseLastw,
            };
        }
    }

    async getEffortsByFilter(filter: GeneralFilterDto): Promise<GetFilteredLastWInterface[]> {
        const {
            period,
            gear_code,
            port_id,
            region,
            coop
        } = filter;

        // With this design I am giving the user the option to filter not only by port, but also by region and coop
        if(!port_id && !region && !coop) {
            throw new NotFoundException('No port, region or coop found');
        }

        const landings = await this.prisma.sense_lastw.findMany({
            where: {
                gear_code: gear_code ? {in: gear_code} : undefined,
                form: {
                    period_date: period,
                    port_id: port_id ? {in: port_id} : undefined,
                    ports: {
                        coop_code: coop ? {in: coop} : undefined,
                        coop: {
                            region_code: region ? {in: region} : undefined
                        }
                    }
                }
            },
            select:{
                gear_code: true,
                days_fished: true,
                form:{
                    select:{
                        form_id: true,
                        port_id: true,
                    }
                }
            }
        });

        if(!landings || landings.length === 0) {
            throw new NotFoundException('No landings found');
        }

        return landings;
    }

    //================================================================================================
    async validate(d: any): Promise<boolean> {
        if (d.gear_code) {
            const gear = await this.prisma.gear.findUnique({
                where: {gear_code: d.gear_code}
            });
            if (!gear) {
                return false;
            }
        }
        if (d.landing_id) {
            const landing = await this.prisma.landing.findUnique({
                where: {landing_id: d.landing_id}
            });
            if (!landing) {
                return false;
            }
        }
    }
}
