import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { FishService } from "../backend/fish/fish.service";
import { LandingsService } from "../backend/landings/landings.service";
import { SenseLastwService } from "../backend/sense_lastw/sense_lastw.service";
import { GeneralFilterDto } from "../shared/dto/GeneralFilter.dto";
import { getDaysInMonthByDate } from "../utils/date/getDaysInAMonth";
import { GearService } from "../backend/gear/gear.service";
import {GetFilteredInterface} from "../backend/landings/interface/getFiltered.interface";
import {mapLandingsAndEffortMapper} from "./utils/mapLandingsAndEffort.mapper";
import {mapLandingsMapForSpecieCountMapper} from "./utils/mapLandingsMapForSpecieCount.mapper";
import {GetFilteredLastWInterface} from "../backend/sense_lastw/interface/getFilteredLastW.interface";
import {mapEffortMapMapper} from "./utils/mapEffortMap.mapper";
import {mapLandingsMapForSpeciePriceMapper} from "./utils/mapLandingsMapForSpeciePrice.mapper";

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
        let mapLandings: Map<number, GetFilteredInterface[]> = mapLandingsAndEffortMapper(landings);
        let speciesMap = mapLandingsMapForSpecieCountMapper(mapLandings);

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
    //TODO: Check if this is the correct implementation
    async getPba(filter: GeneralFilterDto) {
        const data = await this.senseLastWService.getEffortsByFilter(filter);

        let map: Map<number, GetFilteredLastWInterface[]> = mapLandingsAndEffortMapper(data);
        let speciesMap = mapEffortMapMapper(map);

        let sumPba = 0;
        let count = 0;

        for (const efforts of speciesMap.values()) {
            efforts.forEach(({ sumDaysFished, numberOfForms }) => {
                if (numberOfForms > 0) {
                    count++;
                    sumPba += sumDaysFished / numberOfForms;
                }
            });
        }

        return count > 0 ? sumPba / count : 0;
    }


    /**
     * Computes the total fishing effort based on the number of active gears,
     * the number of days in the period, and the Proportion of Boats Active (PBA).
     */
    //ToDo: Check if this is the correct implementation I made it take pba as a parameter to prevent redundancy
    async getTotalEffort(filter: GeneralFilterDto, pba: number) {
        delete filter.gear_code; // Remove specific gear filtering to get total effort
        const data = await this.senseLastWService.getEffortsByFilter(filter);
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

    /**
     * Computes the average fish price by dividing the total price of all fish
     * by the total number of fish caught in the given filter criteria.
     */
    async getAvgFishPrice(filter: GeneralFilterDto) {
        const { gear_code, ...newFilter } = filter;

        const data = await this.landingsService.getLandingsByFilter(newFilter);

        const map: Map<number, GetFilteredInterface[]> = mapLandingsAndEffortMapper(data);
        const fishMap = mapLandingsMapForSpeciePriceMapper(map);

        let sumPrice = 0;
        let count = 0;

        for (const speciesMap of fishMap.values()) {
            for (const { fishTotalPrice, count: speciesCount } of speciesMap.values()) {
                sumPrice += fishTotalPrice;
                count += speciesCount;
            }
        }

        return count > 0 ? sumPrice / count : 0;
    }

    async getAvgFishWeight(filter: GeneralFilterDto){
        const { gear_code, ...newFilter } = filter;

        const data = await this.landingsService.getLandingsByFilter(newFilter);

        let sumWeight = 0;
        let count = 0;

        data.forEach(landing => {
            landing.fish.forEach(fish => {
                sumWeight += fish.fish_weight;
                count++;
            });
        });

        return count > 0 ? sumWeight / count : 0;
    }

    async getAvgFishLength(filter: GeneralFilterDto){
        const { gear_code, ...newFilter } = filter;

        const data = await this.landingsService.getLandingsByFilter(newFilter);

        let sumLength = 0;
        let count = 0;

        data.forEach(landing => {
            landing.fish.forEach(fish => {
                sumLength += fish.fish_length;
                count++;
            });
        });

        return count > 0 ? sumLength / count : 0;
    }

    async getAvgFishQuantity(filter: GeneralFilterDto){
        const { gear_code, ...newFilter } = filter;

        const data = await this.landingsService.getLandingsByFilter(newFilter);

        let sumQuantity = 0;
        let count = 0;

        data.forEach(landing => {
            landing.fish.forEach(fish => {
                sumQuantity += fish.fish_quantity;
                count++;
            });
        });

        return count > 0 ? sumQuantity / count : 0;
    }

    async getAvgFishWeightByKilo(filter: GeneralFilterDto, kg: number){
        const { gear_code, ...newFilter } = filter;

        const data = await this.landingsService.getLandingsByFilter(newFilter);

        let sumWeight = 0;
        let count = 0;

        data.forEach(landing => {
            landing.fish.forEach(fish => {
                sumWeight += fish.fish_weight;
                count++;
            });
        });

        return count > 0 ? sumWeight / count / kg : 0;
    }

    async getEstimateSpeciesCatch(filter: GeneralFilterDto, specie_code: number) {
        // Get the estimated total catch
        const estimatedTotalCatch = await this.getEstimateCatch(filter);

        // Fetch landings data
        const data = await this.landingsService.getLandingsByFilter(filter);

        let sampleSpeciesCatch = 0;
        let sampleTotalCatch = 0;

        data.forEach(landing => {
            landing.fish.forEach(fish => {
                sampleTotalCatch += fish.fish_weight;
                if (fish.specie_code === specie_code) {
                    sampleSpeciesCatch += fish.fish_weight;
                }
            });
        });

        // Prevent division by zero
        if (sampleTotalCatch === 0) return 0;

        // Calculate estimated species catch
        return estimatedTotalCatch * (sampleSpeciesCatch / sampleTotalCatch);
    }

    async getSpeciesCpue(filter: GeneralFilterDto, specie_code: number) {
        const [estimatedSpeciesCatch, estimatedTotalEffort] = await Promise.all([
            this.getEstimateSpeciesCatch(filter, specie_code),
            this.getEstimateEffort(filter)
        ]);

        if (estimatedTotalEffort === 0) return 0;

        return estimatedSpeciesCatch / estimatedTotalEffort;
    }

    async getEstimatedSpeciesValue(filter: GeneralFilterDto, specie_code: number) {
        const [estimatedPrice, estimatedSpeciesCatch] = await Promise.all([
            this.getAvgFishPrice(filter),
            this.getEstimateSpeciesCatch(filter, specie_code)
        ]);

        return estimatedPrice * estimatedSpeciesCatch;
    }




}
