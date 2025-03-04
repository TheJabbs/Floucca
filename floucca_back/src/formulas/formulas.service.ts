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
import {mapLandingsMapper} from "./utils/mapLandings.mapper";
import {mapLandingsMapMapper} from "./utils/mapLandingsMap.mapper";

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
        delete filter.gear_code;

        const landings = await this.landingsService.getLandingsByFilter(filter);
        let fishWeight = 0;

        // Summing up the weight of all fish from all landings
        landings.forEach(landing => {
            landing.fish.forEach(fish => {
                fishWeight += fish.fish_weight;
            });
        });

        return fishWeight / landings.length;
    }

    /**
     * Estimates fishing effort for a specific species by dividing the total fish weight
     * by the CPUE value obtained from the given filter criteria.
     */
    //TODO: Check if this is the correct implementation
    async getEffortBySpecies(filter: GeneralFilterDto) {
        const landings = await this.landingsService.getLandingsByFilter(filter);

        // mapping landings by port ID (stratum) and then by species
        let mapLandings = mapLandingsMapper(landings);
        let speciesMap = mapLandingsMapMapper(mapLandings);

        let filterList = [];

        // preparing the filters for mass fetching
        for (const [port_id, species] of speciesMap) {
            for (const [specie_code, weight] of species) {
                filterList.push({ port_id, specie_code, period: filter.period, weight });
            }
        }

        // parallel fetching
        const cpueValues = await Promise.all(
            filterList.map(f => this.getCpue({ port_id: f.port_id, specie_code: f.specie_code, period: f.period }))
        );

        // calculate total effort
        let totalEffort = filterList.reduce((sum, f, index) => sum + (f.weight / cpueValues[index]), 0);

        return totalEffort / filterList.length;
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
