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
import {countUniquenessInterface} from "./interface/countUniqueness.interface";
import {FleetService} from "../backend/fleet_senses/fleet.service";
import {ActiveDaysService} from "../backend/active_days/activeDays.service";
import {censusCounter} from "./utils/censusCounter";

@Injectable()
export class FormulasService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fishService: FishService,
        private readonly landingsService: LandingsService,
        private readonly senseLastWService: SenseLastwService,
        private readonly fleetService: FleetService,
        private readonly activeDaysService : ActiveDaysService,
        private readonly gearService: GearService
    ) {
    }

    async getReportData(filter: GeneralFilterDto) {
        let filter2 = JSON.parse(JSON.stringify(filter));
        filter2.gear_code = undefined;

        filter.specie_code = await this.fishService.getFishSpecieByGear(filter2);

        console.log("Filter 1:", filter, "Filter 2:", filter2);

        const [effortData, landingData,
            allEffort, fleetCensus, allCensus, activeD] = await Promise.all([
            this.senseLastWService.getEffortsByFilter(filter),
            this.landingsService.getLandingsByFilter(filter),
            this.senseLastWService.getEffortsByFilter(filter2),
            this.fleetService.generateFleetReport(filter, new Date(filter.period).getMonth() + 1),
            this.fleetService.generateFleetReport(filter),
            this.activeDaysService.getActiveDaysByPortId(filter.port_id[0], filter.period)
        ]);

        let totalGears = censusCounter(fleetCensus)
        let totalAllGears = censusCounter(allCensus)

        const pba = this.getPba(effortData);
        const cpue = this.getCpue(effortData.length, landingData);

        // const daysOfTheMonth = getDaysInMonthByDate(filter.period);
        // const sampleEffort = this.getTotalEffort(pba, daysOfTheMonth, allEffort.length);

        const calculatedActiveDays = this.getActiveDays(totalGears, totalAllGears, activeD.active_days);
        const estEffort = this.getEstimateEffort(allEffort.length, calculatedActiveDays, pba);

        const estCatch = this.getEstimateTotalCatch(cpue, estEffort);
        const effortRecords = effortData.length;
        const totalRecords = allEffort.length;

        const landingRecords = this.countLandingForm(landingData);
        const sampleCatch = this.countWeightBySpecie(landingData);

        const avgPrice = this.getAvgPrice(landingData);
        const estValue = avgPrice * estCatch;

        let upperTables = {
            effort: {
                records: effortRecords,
                gears: totalRecords,
                activeDays: activeD,
                pba: pba,
                estEffort: estEffort
            },
            landings: {
                records: landingRecords,
                avgPrice: avgPrice,
                estValue: estValue,
                cpue: cpue,
                estCatch: estCatch,
                // sampleEffort: sampleEffort,
                sampleCatch: sampleCatch
            }
        }

        let mappedSpecies = specieMapMapper(landingData);
        let lowerTable = []

        mappedSpecies.forEach((fish, specie) => {
            let avgWeight = this.getAvgWeight(fish);
            let numbOfCatch = this.getNumberOfCatch(fish);
            let avgPrice = this.getAvgPrice(fish);
            let specieCpue = this.getCpue(effortData.length, fish);
            let estCatch = this.getEstimateCatch(estEffort, specieCpue);
            let effort = this.getEffortBySpecie(numbOfCatch, specieCpue);
            let avgLength = this.getAvgLength(fish);
            let avgQuantity = this.getAvgQuantity(fish);
            let value = avgPrice * estCatch;


            lowerTable.push({
                numbOfCatch: numbOfCatch,
                avgPrice: avgPrice,
                avgWeight: avgWeight,
                avgLength: avgLength,
                avgQuantity: avgQuantity,
                value: value,
                cpue: specieCpue,
                estCatch: estCatch,
                effort: effort,
                specie_name: fish[0].fish.specieName
            })
        });

        return {
            upperTables: upperTables,
            lowerTable: lowerTable
        }
    }


    //=========================Report=Tables================================================================================

    //checked
    getPba(effortData: GetFilteredLastWInterface[]) {
        let sumDaysWorkedLastW = 0;

        effortData.forEach((element) => {
            sumDaysWorkedLastW += element.days_fished;
        });

        return sumDaysWorkedLastW / (effortData.length * 7);
    }

    //Checked
    getCpue(nbOfEffortData: number, landingsData: GetFilteredInterface[]) {
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_weight;
        });

        return sumLandings / nbOfEffortData;
    }

    //Is total number of gear the sum of gears in effort?
    getTotalEffort(pba: number, daysOfTheMonth: number, totalNumberOfGears: number) {
        return pba * daysOfTheMonth * totalNumberOfGears;
    }

    //what is catchBySpecie is it the number of fishes or howmany records with this fish??
    getEffortBySpecie(catchBySpecie: number, cpueOfSpecie: number) {
        return catchBySpecie / cpueOfSpecie;
    }

    // checked
    getEstimateTotalCatch(cpue: number, effortEstimate: number) {
        return cpue * effortEstimate;
    }

    //checked
    getEstimateEffort(boatGears: number, activeDays: number, pba: number) {
        return boatGears * activeDays * pba;
    }

    getActiveDays(currentGears: number, allGears: number, calculatedD : number) {
        //Calculate active days of each gear al summation taba3on over al sum of all gears sum(gearsNum * activD)/sum(all gears)
        return currentGears * calculatedD / allGears;
    }

    getEstimateCatch(estimateEffort: number, cpue: number) {
        return estimateEffort * cpue;
    }

    getAvgWeight(landingsData: GetFilteredInterface[]) {
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_weight;
        });

        return sumLandings / landingsData.length;
    }

    getAvgLength(landingsData: GetFilteredInterface[]) {
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_length;
        });

        return sumLandings / landingsData.length;
    }


    //to be checked
    getAvgPrice(landingsData: GetFilteredInterface[]) {
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.price;
        });

        return sumLandings / landingsData.length;
    }

    getAvgQuantity(landingsData: GetFilteredInterface[]) {
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_quantity;
        });

        return sumLandings / landingsData.length;
    }

    getNumberOfCatch(landingsData: GetFilteredInterface[]) {
        let numberOfCatch = 0

        landingsData.forEach((element) => {
            numberOfCatch += element.fish.fish_weight;
        });

        return numberOfCatch;
    }


    //========================Left Panel=====================================
    async getLeftPanelInfo() {
        const [portsCount, uniqueSpecies, effortRecord, landingRecord, uniqueGears] = await Promise.all([
            this.getSampledPortsCount(),
            this.getUniqueSpeciesFishedByPeriod(),
            this.getRecordsEffortInPeriod(),
            this.getLandingRecordsByPeriod(),
            this.GetUniqueFishingGears()
        ]);

        // Collect all unique periods from all datasets
        const allPeriods = new Set([
            ...Object.keys(portsCount),
            ...Object.keys(uniqueSpecies),
            ...Object.keys(effortRecord),
            ...Object.keys(landingRecord),
            ...Object.keys(uniqueGears)
        ]);

        const dataCombine: Record<string, any> = {};

        allPeriods.forEach(period => {
            dataCombine[period] = {
                strata: portsCount[period] || {port: 0, coop: 0, region: 0},
                speciesKind: uniqueSpecies[period] || 0,
                effortRecord: effortRecord[period] || 0,
                landingRecord: landingRecord[period] || 0,
                uniqueGears: uniqueGears[period] || 0
            };
        });

        return dataCombine;
    }

    async getSampledPortsCount() {
        const forms = await this.prisma.form.findMany({
            select: {
                period_date: true,
                ports: {
                    select: {
                        port_id: true,
                        coop: {
                            select: {
                                coop_code: true,
                                region: {
                                    select: {
                                        region_code: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const result: Record<string, countUniquenessInterface> = {};

        const uniquePortsMap = new Map<string, Set<number>>();
        const uniqueCoopsMap = new Map<string, Set<number>>();
        const uniqueRegionsMap = new Map<string, Set<number>>();

        forms.forEach(form => {
            const period = form.period_date.toDateString();

            if (!uniquePortsMap.has(period)) {
                uniquePortsMap.set(period, new Set());
                uniqueCoopsMap.set(period, new Set());
                uniqueRegionsMap.set(period, new Set());
            }

            const uniquePorts = uniquePortsMap.get(period)!;
            const uniqueCoops = uniqueCoopsMap.get(period)!;
            const uniqueRegions = uniqueRegionsMap.get(period)!;

            if (form.ports) {
                uniquePorts.add(form.ports.port_id);
                if (form.ports.coop) {
                    uniqueCoops.add(form.ports.coop.coop_code);
                    if (form.ports.coop.region) {
                        uniqueRegions.add(form.ports.coop.region.region_code);
                    }
                }
            }
        });

        uniquePortsMap.forEach((ports, period) => {
            result[period] = {
                port: ports.size,
                coop: uniqueCoopsMap.get(period)!.size,
                region: uniqueRegionsMap.get(period)!.size
            };
        });

        return result;
    }

    async getUniqueSpeciesFishedByPeriod() {
        const forms = await this.prisma.form.findMany({
            select: {
                period_date: true,
                landing: {
                    select: {
                        fish: {
                            select: {
                                specie_code: true
                            }
                        }
                    }
                }
            }
        });

        const result: Record<string, number> = {};

        const uniqueSpeciesMap = new Map<string, Set<number>>();

        forms.forEach(form => {
            const period = form.period_date.toDateString(); // Ensure consistent date format

            if (!uniqueSpeciesMap.has(period)) {
                uniqueSpeciesMap.set(period, new Set());
            }

            const uniqueSpecies = uniqueSpeciesMap.get(period)!; // Get the Set for this period

            if (form.landing && Array.isArray(form.landing)) {
                form.landing.forEach(landing => {
                    if (landing.fish && Array.isArray(landing.fish)) {
                        landing.fish.forEach(fish => {
                            uniqueSpecies.add(fish.specie_code);
                        });
                    }
                });
            }
        });

        uniqueSpeciesMap.forEach((speciesSet, period) => {
            result[period] = speciesSet.size;
        });

        return result;
    }

    async getRecordsEffortInPeriod() {
        const form = await this.prisma.sense_lastw.findMany({
            distinct: ['form_id'],
            select: {
                form: {
                    select: {
                        period_date: true
                    }
                },
            },
        })


        const mapUsingPeriodDate: Record<string, number> = {};

        form.forEach((element) => {
            const periodKey = element.form.period_date.toDateString(); // Convert Date to string

            if (mapUsingPeriodDate.hasOwnProperty(periodKey)) {
                mapUsingPeriodDate[periodKey] += 1;
            } else {
                mapUsingPeriodDate[periodKey] = 1;
            }
        });

        return mapUsingPeriodDate;
    }

    async getLandingRecordsByPeriod() {
        const form = await this.prisma.landing.findMany({
            distinct: ['form_id'],
            select: {
                landing_id: true,
                form: {
                    select: {
                        period_date: true
                    }
                }
            }
        })

        const mapUsingPeriodDate: Record<string, number> = {};

        form.forEach((element) => {
            const periodKey = element.form.period_date.toDateString(); // Convert Date to string

            if (mapUsingPeriodDate.hasOwnProperty(periodKey)) {
                mapUsingPeriodDate[periodKey] += 1;
            } else {
                mapUsingPeriodDate[periodKey] = 1;
            }
        });

        return mapUsingPeriodDate;
    }

    async GetUniqueFishingGears() {
        const form = await this.prisma.form.findMany({
            select: {
                period_date: true,
                sense_lastw: {
                    select: {
                        gear_code: true
                    }
                }
            }
        })

        const mapUsingPeriodDate: Record<string, number> = {};

        form.forEach((element) => {
            const periodKey = element.period_date.toDateString();
            const counter: Set<number> = new Set();


            if (element.sense_lastw) {
                element.sense_lastw.forEach((gear) => {
                    counter.add(gear.gear_code);
                });
            }

            mapUsingPeriodDate[periodKey] = counter.size;
        });

        return mapUsingPeriodDate;
    }

    //=============================================================

    countLandingForm(landingData: GetFilteredInterface[]) {
        const mapUsingFormId: Map<number, GetFilteredInterface[]> = new Map();

        landingData.forEach((element) => {
            if (mapUsingFormId.has(element.form.form_id)) {
                mapUsingFormId.get(element.form.form_id).push(element);
            } else {
                mapUsingFormId.set(element.form.form_id, [element]);
            }
        });

        return mapUsingFormId.size;

    }

    countCatchBySpecie(landingData: GetFilteredInterface[]) {
        let count = 0

        landingData.forEach((element) => {
            count += element.fish.fish_quantity;
        });

        return count;
    }

    //checked
    countWeightBySpecie(landingData: GetFilteredInterface[]) {
        let count = 0

        landingData.forEach((element) => {
            count += element.fish.fish_weight;
        });

        return count;
    }

}