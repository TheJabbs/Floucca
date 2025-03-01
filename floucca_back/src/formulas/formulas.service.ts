import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FishService } from "../backend/fish/fish.service";
import { LandingsService } from "../backend/landings/landings.service";
import { SenseLastwService } from "../backend/sense_lastw/sense_lastw.service";
import { GeneralFilterDto } from "../shared/dto/GeneralFilter.dto";
import { idDTO } from "../shared/dto/id.dto";
import { getDaysInMonthByDate } from "../utils/date/getDaysInAMonth";
import { GearService } from "../backend/gear/gear.service";
import {GetFilteredInterface} from "../backend/landings/interface/getFiltered.interface";

@Injectable()
export class FormulasService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fishService: FishService,
        private readonly landingsService: LandingsService,
        private readonly senseLastWService: SenseLastwService,
        private readonly gearService: GearService
    ) {}

    /**
     * Calculates Catch Per Unit Effort (CPUE) by dividing the total fish weight
     * by the number of landings that match the given filter criteria.
     */
    async getCpue(filter: GeneralFilterDto) {
        const landings = await this.landingsService.getLandingsByFilter(filter);

        let mapper : Map<number, GetFilteredInterface[]> = new Map();

        // mapping the landings to the port_id
        landings.forEach(landing => {
            if (mapper.has(landing.port_id)) {
                mapper.get(landing.port_id).push(landing);
            } else {
                mapper.set(landing.port_id, [landing]);
            }
        });

        /**
         *  for each port we calculate the total fish weight abd divide by the
         *   number of landings then we add them all together and divide by the
         *   number of different ports
         */
        let sum = 0;

        mapper.forEach((value, key) => {
            let totalFishWeight = 0;
            value.forEach(landing => {
                landing.fish.forEach(fish => {
                    totalFishWeight += fish.fish_weight;
                });
            });

            sum += totalFishWeight / value.length;
        });

        return  sum / mapper.size;
    }

    /**
     * Estimates fishing effort for a specific species by dividing the total fish weight
     * by the CPUE value obtained from the given filter criteria.
     */
    async getEffortBySpecies(filter: GeneralFilterDto, code: idDTO) {
        const cpue = await this.getCpue(filter);
        const fishes = await this.fishService.getAllFishByFilter(filter, code);

        let fishWeight = 0;
        fishes.forEach(fish => {
            fishWeight += fish.fish_weight;
        });

        return fishWeight / cpue;
    }

    /**
     * Calculates the Proportion of Boats Active (PBA), which is the ratio of
     * days fished to the total number of examined days.
     */
    async getPba(filter: GeneralFilterDto) {
        const data = await this.senseLastWService.getEffortsByFilter(filter);
        let daysExamined = data.length * 7; // Assuming each data entry represents a weekly report
        let daysFished = 0;

        data.forEach(effort => {
            daysFished += effort.days_fished;
        });

        return daysFished / daysExamined;
    }

    /**
     * Computes the total fishing effort based on the number of active gears,
     * the number of days in the period, and the Proportion of Boats Active (PBA).
     */
    async getTotalEffort(filter: GeneralFilterDto) {
        delete filter.gear_code; // Remove specific gear filtering to get total effort
        const data = await this.senseLastWService.getEffortsByFilter(filter);
        const pba = await this.getPba(filter);
        const periodDate = new Date(filter.period);
        const days = getDaysInMonthByDate(periodDate.toDateString());
        const numberGear = data.length;

        return days * numberGear * pba;
    }

    /**
     * Calculates the number of active fishing days by considering the number of gears
     * and the total days fished across all efforts.
     */
    async getActiveDays(filter: GeneralFilterDto) {
        const data = await this.senseLastWService.getEffortsByFilter(filter);
        const allGears = await this.gearService.getAllGear();

        let activeDays = 0;
        data.forEach(effort => {
            activeDays += effort.days_fished;
        });

        return (activeDays * data.length) / allGears.length;
    }

    /**
     * Estimates fishing effort by multiplying active days, the total number of gears,
     * and the Proportion of Boats Active (PBA).
     */
    async getEstimateEffort(filter: GeneralFilterDto) {
        const activeDays = await this.getActiveDays(filter);
        const allGears = await this.gearService.getAllGear();
        const pba = await this.getPba(filter);

        return activeDays * allGears.length * pba;
    }

    /**
     * Computes the estimated catch by multiplying the estimated fishing effort
     * with the Catch Per Unit Effort (CPUE).
     */
    async getEstimateCatch(filter: GeneralFilterDto) {
        delete filter.gear_code; // Remove specific gear filtering for total estimate
        return await this.getEstimateEffort(filter) * await this.getCpue(filter);
    }
}
