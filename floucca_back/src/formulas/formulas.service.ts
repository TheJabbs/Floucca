import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {FishService} from "../backend/fish/fish.service";
import {LandingsService} from "../backend/landings/landings.service";
import {SenseLastwService} from "../backend/sense_lastw/sense_lastw.service";
import {GearService} from "../backend/gear/gear.service";
import {GetFilteredLastWInterface} from "../backend/sense_lastw/interface/get_filtered_lastw.interface";
import {GetFilteredInterface} from "../backend/landings/interface/get_filtered.interface";
import {GeneralFilterDto} from "../shared/dto/general_filter.dto";
import {getDaysInMonthByDate} from "../utils/date/get_days_in_a_month";
import {specieMapMapper} from "./utils/specie_map.mapper";

@Injectable()
export class FormulasService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fishService: FishService,
        private readonly landingsService: LandingsService,
        private readonly senseLastWService: SenseLastwService,
        private readonly gearService: GearService
    ) {}

    async getReportData(filter: GeneralFilterDto){
        let filter2 = JSON.parse(JSON.stringify(filter));
        filter2.gear_code= undefined;

        filter.specie_code = await this.fishService.getFishSpecieByGear(filter2);

        console.log("Filter 1:", filter, "Filter 2:", filter2);

        const [effortData, landingData, allEffort] = await Promise.all([
            this.senseLastWService.getEffortsByFilter(filter),
            this.landingsService.getLandingsByFilter(filter),
            this.senseLastWService.getEffortsByFilter(filter2)
        ]);

        const pba = this.getPba(effortData);
        const cpue = this.getCpue(effortData.length, landingData);

        const daysOfTheMonth = getDaysInMonthByDate(filter.period);
        const sampleEffort = this.getTotalEffort(pba, daysOfTheMonth, allEffort.length);

        const activeDays = this.getActiveDays(allEffort, allEffort.length);
        const estEffort = this.getEstimateEffort(allEffort.length, activeDays, pba);

        const estCatch = this.getEstimateTotalCatch(cpue, estEffort);
        const effortRecords = effortData.length;
        const totalRecords = allEffort.length;

        const landingRecords = this.countLandingForm(landingData);
        const sampleCatch = this.countCatchBySpecie(landingData);

        const avgPrice = this.getAvgPrice(landingData);

        let upperTables = {
            effort: {
                records: effortRecords,
                gears: totalRecords,
                activeDays: activeDays,
                pba: pba,
                estEffort: estEffort
            },
            landings: {
                records: landingRecords,
                avgPrice: avgPrice,
                estValue: 0,
                cpue: cpue,
                estCatch: estCatch,
                sampleEffort: sampleEffort,
                sampleCatch: sampleCatch
            }
        }

        let mappedSpecies = specieMapMapper(landingData);
        let lowerTable = []

        mappedSpecies.forEach((fish, specie) => {
            let avgWeight = this.getAvgWeight(fish);
            let numbOfCatch = this.getNumberOfCatch(fish);
            let avgPrice = this.getAvgPrice(fish);
            let value = 0;
            let specieCpue = this.getCpue(fish.length, fish);
            let estCatch = this.getEstimateCatch(estEffort, specieCpue);
            let effort = this.getEffortBySpecie(numbOfCatch, specieCpue);
            let avgLength = this.getAvgLength(fish);
            let avgQuantity = this.getAvgQuantity(fish);

            lowerTable.push({
                numbOfCatch: numbOfCatch,
                avgPrice: avgPrice,
                avgWeight: avgWeight,
                avgLength: avgLength,
                avgQuantity: avgQuantity,
                value: value,
                cpue: specieCpue,
                estCatch: estCatch,
                effort: effort
            })
        });

        return {
            upperTables: upperTables,
            lowerTable: lowerTable
        }
    }








    //=========================================================================================================

    //Is it filtered by gear or all gears from that period?
    getPba(effortData : GetFilteredLastWInterface[]){
        let sumDaysWorkedLastW = 0;

        effortData.forEach((element) => {
            sumDaysWorkedLastW += element.days_fished;
        });

        return sumDaysWorkedLastW / (effortData.length * 7);
    }

    //This is effort not number of effort form?
    getCpue(nbOfEffortData: number, landingsData: GetFilteredInterface[]){
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_weight;
        });

        return sumLandings / nbOfEffortData;
    }

    //Is total number of gear the sum of gears in effort?
    getTotalEffort(pba: number, daysOfTheMonth: number, totalNumberOfGears: number){
        return pba * daysOfTheMonth * totalNumberOfGears;
    }

    //what is catchBySpecie is it the number of fishes or howmany records with this fish??
    getEffortBySpecie(catchBySpecie: number, cpueOfSpecie: number){
        return catchBySpecie / cpueOfSpecie;
    }

    getEstimateTotalCatch(cpue: number, effortEstimate: number){
        return cpue * effortEstimate;
    }

    getEstimateEffort(boatGears: number,  activeDays: number, pba: number){
        return boatGears * activeDays * pba;
    }

    // not sure of this formula please check it
    getActiveDays(effortData: GetFilteredLastWInterface[], allGears: number){
        let sumDaysWorkedLastW = 0;

        effortData.forEach((element) => {
            sumDaysWorkedLastW += element.days_fished;
        });

        return sumDaysWorkedLastW * effortData.length / allGears;
    }

    getEstimateCatch(estimateEffort: number, cpue: number){
        return estimateEffort * cpue;
    }

    getAvgWeight(landingsData: GetFilteredInterface[]){
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_weight;
        });

        return sumLandings / landingsData.length;
    }

    getAvgLength(landingsData: GetFilteredInterface[]){
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_length;
        });

        return sumLandings / landingsData.length;
    }

    getAvgPrice(landingsData: GetFilteredInterface[]){
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.price;
        });

        return sumLandings / landingsData.length;
    }

    getAvgQuantity(landingsData: GetFilteredInterface[]){
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_quantity;
        });

        return sumLandings / landingsData.length;
    }

    getNumberOfCatch(landingsData: GetFilteredInterface[]){
        let numberOfCatch = 0

        landingsData.forEach((element) => {
            numberOfCatch += element.fish.fish_quantity;
        });

        return numberOfCatch;
    }

    //=============================================================

    countLandingForm(landingData: GetFilteredInterface[]){
        const mapUsingFormId: Map<number, GetFilteredInterface[]> = new Map();

        landingData.forEach((element) => {
            if(mapUsingFormId.has(element.form.form_id)){
                mapUsingFormId.get(element.form.form_id).push(element);
            }else{
                mapUsingFormId.set(element.form.form_id, [element]);
            }
        });

        return mapUsingFormId.size;

    }

    countCatchBySpecie(landingData: GetFilteredInterface[]){
        let count = 0

        landingData.forEach((element) => {
            count += element.fish.fish_quantity;
        });

        return count;
    }

}