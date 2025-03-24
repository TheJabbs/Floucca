import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {FishService} from "../backend/fish/fish.service";
import {LandingsService} from "../backend/landings/landings.service";
import {SenseLastwService} from "../backend/sense_lastw/sense_lastw.service";
import {GeneralFilterDto} from "../shared/dto/GeneralFilter.dto";
import {getDaysInMonthByDate} from "../utils/date/getDaysInAMonth";
import {GearService} from "../backend/gear/gear.service";
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
import {FishDataInterface} from "./interface/fishData.interface";
import {mapLandingsBySpecieMapper} from "./utils/mapLandingsBySpecie.mapper";
import {mapSpeciesMapper} from "./utils/mapSpecies.mapper"; //


@Injectable()
export class FormulasService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fishService: FishService,
        private readonly landingsService: LandingsService,
        private readonly senseLastWService: SenseLastwService,
        private readonly gearService: GearService
    ) {
    }

    //Services for the controller


    /**
     * This subsection is to get all the data for the form reports
     * */

    //This function returns the entire page
    async getReport(filter: GeneralFilterDto): Promise<any> {

        filter.specie_code = await this.fishService.getFishSpecieByGear(filter.period, filter.gear_code);

        const [effortData, landingData] = await Promise.all([
            this.senseLastWService.getEffortsByFilter(filter),
            this.landingsService.getLandingsByFilter(filter)
        ]);

        const uperTable = await this.getEffortAndLanding(effortData, landingData, JSON.parse(JSON.stringify(filter)));
        const lowerTable = await this.getSingularFishData(landingData, uperTable.landings.estCatch, uperTable.effort.estEffort);
        return {
            uperTable: uperTable,
            lowerTable: lowerTable
        }
    }

    async getEffortAndLanding(effortData: GetFilteredLastWInterface[], landingData: GetFilteredInterface[], filter: GeneralFilterDto): Promise<GetEffortAndLandingInterface> {
        delete filter.gear_code
        const [pba, allGears, totalGears] = await Promise.all([
            this.getPba(JSON.parse(JSON.stringify(effortData))),
            this.gearService.getAllGear(),
            this.landingsService.getLandingsByFilter(filter)
        ]);

        const estEffort = await this.getEstimateEffort(pba, effortData, allGears);
        const estCatch = await this.getEstimateCatchForAllSpecies(landingData, estEffort);


        const [avgPrice, estValue, cpue, estCatch2, activeDays] = await Promise.all([
            this.getAvgFishPrice(landingData),
            this.getEstimatedSpeciesValue(landingData, estCatch),
            this.getSpeciesCpue(estCatch, estEffort),
            this.getEstimateSpeciesCatch(landingData, estCatch),
            this.getActiveDays(effortData, allGears),
        ]);

        const sampleEffort = await this.getEffortBySpecies(landingData, cpue)

        return {
            effort: {
                records: effortData.length,
                gears: totalGears.length,
                activeDays: activeDays,
                pba: pba,
                estEffort: estEffort
            },
            landings: {
                records: landingData.length,
                avgPrice: avgPrice,
                estValue: estValue,
                cpue: cpue,
                estCatch: estCatch2,
                sampleEffort: sampleEffort
            }
        }
    }

    async getSingularFishData(landingData: GetFilteredInterface[], estTotalCatch: number, totalEffort: number): Promise<FishDataInterface[]> {
        const map = mapSpeciesMapper(landingData);
        let fishData: FishDataInterface[] = [];

        for (const [specie, count] of map.entries()) {
            const [ estCatch, avgPrice, avgFishWeight, avgFishQuantity, avgFishLength, avgFishWeightByKilo, totalCatch] = await Promise.all([
                this.getEstimateSpeciesCatch(count, estTotalCatch),
                this.getAvgFishPrice(count),
                this.getAvgFishWeight(count),
                this.getAvgFishQuantity(count),
                this.getAvgFishLength(count),
                this.getAvgFishWeightByKilo(count, 1),
                this.getTotalCatch(count)
            ]);

            const cpue = await this.getSpeciesCpue(estCatch, totalEffort);

            fishData.push({
                specie_code: specie,
                specie_name: count[0].fish[0].specieName,
                all_fished: totalCatch,
                avg_fish_weight: avgFishWeight,
                avg_fish_quantity: avgFishQuantity,
                avg_fish_length: avgFishLength,
                avg_price: avgPrice,
                fish_value: avgPrice * avgFishQuantity,
                cpue: cpue,
                est_catch: estCatch,
            });
        }

        return fishData;
    }


    //Operational Formulas


    /**
     * Calculates Catch Per Unit Effort (CPUE) by dividing the total fish weight
     * by the number of landings that match the given filter criteria.
     */
    async getCpue(landingData: GetFilteredInterface[]) {
        let fishWeight = 0;

        // Summing up the weight of all fish from all landings
        landingData.forEach(landing => {
            landing.fish.forEach(fish => {
                fishWeight += fish.fish_weight;
            });
        });

        return fishWeight / landingData.length;
    }

    /**
     * catche by specie/ cpue
     * NOT APPLICABLE FOR MULTI DATA
     **/
    async getEffortBySpecies(data: GetFilteredInterface[], cpue: number) {
        const map = mapLandingsBySpecieMapper(data);

        //calculate the cpu of each specie then devide by the count
        let sum = 0;
        let count = 0;
        for (const [specie, specieCount] of map.entries()) {
            sum += specie * cpue;
            count += specieCount;
        }

        return count > 0 ? sum / count : 0;
    }


    /**
     * Calculates the Proportion of Boats Active (PBA), which is the ratio of
     * days fished to the total number of examined days.
     */
    //TODO: Check if this is the correct implementation
    async getPba(data: GetFilteredLastWInterface[]) {

        let map: Map<number, GetFilteredLastWInterface[]> = mapLandingsAndEffortMapper(data);
        let speciesMap = mapEffortMapMapper(map);

        let sumPba = 0;
        let count = 0;

        for (const efforts of speciesMap.values()) {
            efforts.forEach(({sumDaysFished, numberOfForms}) => {
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
    async getTotalEffort(filter: GeneralFilterDto, data: GetFilteredLastWInterface[], pba: number) {
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
    async getEstimateCatchForAllSpecies(landingData: GetFilteredInterface[], estEffort: number) {
        return estEffort * await this.getCpue(landingData);
    }

    /**
     * Computes the average fish price by dividing the total price of all fish
     * by the total number of fish caught in the given filter criteria.
     */
    async getAvgFishPrice(data: GetFilteredInterface[]) {

        const map: Map<number, GetFilteredInterface[]> = mapLandingsAndEffortMapper(data);
        const fishMap = mapLandingsMapForSpeciePriceMapper(map);

        let sumPrice = 0;
        let count = 0;

        for (const speciesMap of fishMap.values()) {
            for (const {fishTotalPrice, count: speciesCount} of speciesMap.values()) {
                sumPrice += fishTotalPrice;
                count += speciesCount;
            }
        }

        return count > 0 ? sumPrice / count : 0;
    }

    async getAvgFishWeight(dataLanding:  GetFilteredInterface[]) {


        let sumWeight = 0;
        let count = 0;

        dataLanding.forEach(landing => {
            landing.fish.forEach(fish => {
                sumWeight += fish.fish_weight;
                count++;
            });
        });

        return count > 0 ? sumWeight / count : 0;
    }

    async getAvgFishLength (data: GetFilteredInterface[]) {

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

    async getAvgFishQuantity(data: GetFilteredInterface[]) {

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

    async getAvgFishWeightByKilo(data: GetFilteredInterface[], kg: number) {

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

    async getEstimateSpeciesCatch(data: GetFilteredInterface[], estimatedTotalCatch: number) {

        let sampleSpeciesCatch = 0;
        let sampleTotalCatch = 0;

        data.forEach(landing => {
            landing.fish.forEach(fish => {
                sampleTotalCatch += fish.fish_quantity;
                sampleSpeciesCatch += fish.fish_quantity;
            });
        });

        // Prevent division by zero
        if (sampleTotalCatch === 0) return 0;

        // Calculate estimated species catch
        return estimatedTotalCatch * (sampleSpeciesCatch / sampleTotalCatch);
    }

    async getSpeciesCpue(estimatedSpeciesCatch: number, estimatedTotalEffort: number) {

        if (estimatedTotalEffort === 0) return 0;

        return estimatedSpeciesCatch / estimatedTotalEffort;
    }

    async getEstimatedSpeciesValue(dataLanding: GetFilteredInterface[], estimatedSpeciesCatch: number) {
        const [estimatedPrice,] = await Promise.all([
            this.getAvgFishPrice(dataLanding),
        ]);

        return estimatedPrice * estimatedSpeciesCatch;
    }

    async getTotalCatch(landings: GetFilteredInterface[]) {

        let totalCatch = 0;
        landings.forEach(landing => {
            landing.fish.forEach(fish => {
                totalCatch += fish.fish_quantity;
            });
        });

        return totalCatch;
    }


}
