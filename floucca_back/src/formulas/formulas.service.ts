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
import _ from "lodash";
import {GetEffortAndLandingInterface} from "./interface/getEffortAndLanding.interface";
import {GetAllGearInterface} from "../backend/gear/interface/GetAllGear.interface";
import {GetAllLandingsInterface} from "../backend/landings/interface/getAllLandings.interface";
import {FishDataInterface} from "./interface/fishData.interface"; //


@Injectable()
export class FormulasService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fishService: FishService,
        private readonly landingsService: LandingsService,
        private readonly senseLastWService: SenseLastwService,
        private readonly gearService: GearService
    ) {}

    //Services for the controller


    /**
     * This subsection is to get all the data for the form reports
     * */

    //This function returns the entire page
    async getReport(filter: GeneralFilterDto): Promise<{uperTable: GetEffortAndLandingInterface, lowerTable: FishDataInterface[]}> {
        const uperTable = await this.getEffortAndLanding(filter);
        const lowerTable = await this.getSingularFishData(filter, uperTable.landings.estCatch);

        return {
            uperTable: uperTable,
            lowerTable: lowerTable
        }
    }

    async getEffortAndLanding(filter: GeneralFilterDto): Promise<GetEffortAndLandingInterface> {
        const filterCopy = _.cloneDeep(filter);
        let effortFilter = _.cloneDeep(filterCopy);
        delete effortFilter.gear_code
        delete effortFilter.specie_code

        const [dataCopy, data2Copy] = await Promise.all([
            this.senseLastWService.getEffortsByFilter(filterCopy).then(_.cloneDeep),
            this.landingsService.getLandingsByFilter(filterCopy).then(_.cloneDeep)
        ]);

        const [pba, allGears] = await Promise.all([
            this.getPba(_.cloneDeep(dataCopy)),
            this.gearService.getAllGear().then(_.cloneDeep)
        ]) ;

        const estEffort = await this.getEstimateEffort(pba, _.cloneDeep(dataCopy), allGears);
        const estCatch = await this.getEstimateCatchForAllSpecies(_.cloneDeep(filterCopy), estEffort);



        const [avgPrice, estValue, cpue, estCatch2, activeDays, sampleEffort ] = await Promise.all([
            this.getAvgFishPrice(_.cloneDeep(filterCopy)),
            this.getEstimatedSpeciesValue(_.cloneDeep(filterCopy), 1, estCatch),
            this.getSpeciesCpue(_.cloneDeep(filterCopy), 1, _.cloneDeep(estCatch), _.cloneDeep(estEffort)),
            this.getEstimateCatchForAllSpecies(_.cloneDeep(filterCopy),  estCatch),
            this.getActiveDays(dataCopy, allGears),
            this.getEffortBySpecies(dataCopy, effortFilter)
        ]);

        return {
            effort : {
                records: dataCopy.length,
                gears: allGears.length,
                activeDays: activeDays,
                pba: pba,
                estEffort: estEffort
            },
            landings: {
                records: data2Copy.length,
                avgPrice: avgPrice,
                estValue: estValue,
                cpue: cpue,
                estCatch: estCatch2,
                sampleEffort: sampleEffort
            }
        }
    }

    //ToDo: I will make it more efficient by fetching all the data at once
    async getSingularFishData(filter: GeneralFilterDto, estTotalCatch: number): Promise<FishDataInterface[]> {
        let filterArray : GeneralFilterDto[] = [];

        filter.specie_code.forEach(specie_code => {
            filterArray.push({...filter, specie_code: [specie_code]});
        })

        const data = await Promise.all(filterArray.map(f => this.landingsService.getLandingsByFilter(f)));
        let fishData: FishDataInterface[] = [];

        for (let i = 0; i < filterArray.length; i++) {
            const [cpue, estCatch, avgPrice, avgFishWeight, avgFishQuantity, avgFishLength, avgFishWeightByKilo] = await Promise.all([
                this.getCpue(filterArray[i]),
                this.getEstimateSpeciesCatch(data[i], filterArray[i].specie_code[0], estTotalCatch),
                this.getAvgFishPrice(filterArray[i]),
                this.getAvgFishWeight(filterArray[i]),
                this.getTotalCatch(filterArray[i]),
                this.getAvgFishLength(filterArray[i]),
                this.getAvgFishWeightByKilo(filterArray[i], 1)
            ]);

            const fishValue = avgPrice * estCatch;

            fishData.push({
                specie_code: filterArray[i].specie_code[0],
                avg_fish_weight: avgFishWeight,
                avg_fish_quantity: avgFishQuantity,
                avg_fish_length: avgFishLength,
                avg_price: avgPrice,
                fish_value: fishValue,
                cpue: cpue,
                est_catch: estCatch
            });
        }

        return fishData;
    }




    //Operational Formulas


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
    async getEffortBySpecies(data: GetFilteredInterface[], filter: GeneralFilterDto) {

        // mapping landings by port ID (stratum) and then by species
        let mapLandings: Map<number, GetFilteredInterface[]> = mapLandingsAndEffortMapper(data);
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
    async getPba(data : GetFilteredLastWInterface[]) {

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
    async getTotalEffort(filter: GeneralFilterDto,data: GetFilteredLastWInterface[], pba: number) {
        delete filter.gear_code; // Remove specific gear filtering to get total effort
        const periodDate = new Date(filter.period);
        const days = getDaysInMonthByDate(periodDate.toDateString());
        const numberGear = data.length;

        return days * numberGear * pba;
    }

    /**
     * Calculates the number of active fishing days by considering the number of gears
     * and the total days fished across all efforts.
     */
    async getActiveDays(data: GetFilteredLastWInterface[], allGears: GetAllGearInterface[]) {

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
    async getEstimateEffort(pba: number, data: GetFilteredLastWInterface[], allGears: GetAllGearInterface[]) {
        const activeDays = await this.getActiveDays(data, allGears);

        return activeDays * allGears.length * pba;
    }

    /**
     * Computes the estimated catch by multiplying the estimated fishing effort
     * with the Catch Per Unit Effort (CPUE).
     */
    async getEstimateCatchForAllSpecies(filter: GeneralFilterDto, estEffort: number) {
        delete filter.gear_code; // Remove specific gear filtering for total estimate
        return estEffort * await this.getCpue(filter);
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

    async getEstimateSpeciesCatch(data: GetFilteredInterface[], specie_code: number, estimatedTotalCatch: number) {

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

    async getSpeciesCpue(filter: GeneralFilterDto, specie_code: number, estimatedSpeciesCatch: number, estimatedTotalEffort: number) {

        if (estimatedTotalEffort === 0) return 0;

        return estimatedSpeciesCatch / estimatedTotalEffort;
    }

    async getEstimatedSpeciesValue(filter: GeneralFilterDto, specie_code: number, estimatedSpeciesCatch: number) {
        const [estimatedPrice,] = await Promise.all([
            this.getAvgFishPrice(filter),
        ]);

        return estimatedPrice * estimatedSpeciesCatch;
    }

    async getTotalCatch(filter: GeneralFilterDto) {
        const landings = await this.landingsService.getLandingsByFilter(filter);

        let totalCatch = 0;
        landings.forEach(landing => {
            landing.fish.forEach(fish => {
                totalCatch += fish.fish_quantity;
            });
        });

        return totalCatch;
    }




}
