import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {FishService} from "../backend/fish/fish.service";
import {LandingsService} from "../backend/landings/landings.service";
import {SenseLastwService} from "../backend/sense_lastw/sense_lastw.service";
import {GearService} from "../backend/gear/gear.service";
import {GetFilteredLastWInterface} from "../backend/sense_lastw/interface/get_filtered_lastw.interface";
import {GetFilteredInterface} from "../backend/landings/interface/get_filtered.interface";
import {GeneralFilterDto} from "../shared/dto/general_filter.dto";
import {specieMapMapper} from "./utils/specie_map.mapper";
import {countUniquenessInterface} from "./interface/countUniqueness.interface";
import {FleetService} from "../backend/fleet_senses/fleet.service";
import {ActiveDaysService} from "../backend/active_days/activeDays.service";
import {censusCounter} from "./utils/censusCounter";
import {FleetReportInterface} from "../backend/fleet_senses/interface/fleetReport.interface";
import {WorkLoadStatisticInterface} from "./interface/workLoadStatistic.interface";
import {sampleDayCounter} from "./utils/sampleDayCounter";
import {mergeCensusMapper} from "./utils/mergers/mergeCensus.mapper";
import {mergeEffortMapper} from "./utils/mergers/mergeEffort.Mapper";
import {mergeLandingMapper} from "./utils/mergers/mergeLanding.mapper";

@Injectable()
export class FormulasService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly fishService: FishService,
        private readonly landingsService: LandingsService,
        private readonly senseLastWService: SenseLastwService,
        private readonly fleetService: FleetService,
        private readonly activeDaysService: ActiveDaysService,
        private readonly gearService: GearService
    ) {
    }

    //==============================================


    async getReportData(filter: GeneralFilterDto, user?: number) {
        let filter2 = JSON.parse(JSON.stringify(filter));
        filter2.gear_code = undefined;

        filter.specie_code = await this.fishService.getFishSpecieByGear(filter2);

        console.log("Filter 1:", filter, "Filter 2:", filter2);

        let [effortData, landingData,
            allEffort, fleetCensus, allCensus] = await Promise.all([
            this.senseLastWService.getEffortsByFilter(filter),
            this.landingsService.getLandingsByFilter(filter, user),
            this.senseLastWService.getEffortsByFilter(filter2),
            this.fleetService.generateFleetReport(filter, new Date(filter.period).getMonth() + 1),
            this.fleetService.generateFleetReport(filter2, new Date(filter.period).getMonth() + 1),
        ]);

        // mapping for multi data
        allCensus = mergeCensusMapper(allCensus);
        effortData = mergeEffortMapper(effortData);
        landingData = mergeLandingMapper(landingData);
        allEffort = mergeEffortMapper(allEffort);
        fleetCensus = mergeCensusMapper(fleetCensus);


        let totalGears = censusCounter(fleetCensus)
        let totalAllGears = censusCounter(allCensus)

        const pba = this.getPba(effortData);
        const cpue = this.getCpue(landingData.length, landingData);

        // const daysOfTheMonth = getDaysInMonthByDate(filter.period);
        // const sampleEffort = this.getTotalEffort(pba, daysOfTheMonth, allEffort.length);

        const calculatedActiveDays = this.getActiveDays(allCensus);
        const estEffort = this.getEstimateEffort(allEffort.length, calculatedActiveDays, pba);

        const estCatch = this.getEstimateTotalCatch(cpue, estEffort);

        const landingRecords = this.countLandingForm(landingData);
        const sampleCatch = this.countWeightBySpecie(landingData);

        const avgPrice = this.getAvgPrice(landingData);


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

        let totalVal = 0
        lowerTable.forEach((element) => {
            totalVal += element.value
        })

        let upperTables = {
            effort: {
                records: totalGears,
                gears: totalAllGears,
                activeDays: calculatedActiveDays,
                pba: pba,
                estEffort: estEffort
            },
            landings: {
                records: landingRecords,
                avgPrice: avgPrice,
                estValue: totalVal,
                cpue: cpue,
                estCatch: estCatch,
                // sampleEffort: sampleEffort,
                sampleCatch: sampleCatch
            }
        }

        return {
            upperTables: upperTables,
            lowerTable: lowerTable
        }
    }


    //===================Progress Monitoring===============

    async generateProgressMonitoring(filter: GeneralFilterDto): Promise<WorkLoadStatisticInterface[]> {
        const month = new Date(filter.period).getMonth() + 1;

        const [fleetCensus] = await Promise.all([
            this.fleetService.generateFleetReport(filter, month),
        ]);

        // Precompute gear_code -> freq map
        const gearFreqMap = new Map(fleetCensus.map(el => [el.gear_code, el.freq]));

        // Process each gear in parallel
        return await Promise.all(
            fleetCensus.map(async element => {
                const [landingStat, effortStat] = await Promise.all([
                    this.gearService.getSamplingGearsDaysLanding(element.gear_code, filter.period),
                    this.gearService.getSamplingGearsDaysEffort(element.gear_code, filter.period),
                ]);

                const gu = gearFreqMap.get(element.gear_code) ?? 0;

                return {
                    gearName: element.gear_name,
                    gearUnit: gu,
                    landing: {
                        samplingDays: sampleDayCounter(landingStat),
                        samplingDaysMin: 8,
                        samples: landingStat.length,
                        samplesMin: Math.round(gu * gu * -0.000059 + 0.056530 * gu + 17.580268),
                    },
                    effort: {
                        samples: effortStat.length,
                        samplesMin:Math.round(gu * gu * -0.000015 + 0.024229 * gu + 12.317537),
                    }
                };
            })
        );
    }

    //===============Report=Tables=================

    //checked
    getPba(effortData: GetFilteredLastWInterface[]) {
        let sumDaysWorkedLastW = 0;

        effortData.forEach((element) => {
            sumDaysWorkedLastW += element.days_fished;
        });

        return sumDaysWorkedLastW / (effortData.length * 7);
    }

    //Checked
    getCpue(tripDuration: number, landingsData: GetFilteredInterface[]) {
        let sumLandings = 0;

        landingsData.forEach((element) => {
            sumLandings += element.fish.fish_weight;
        });

        return sumLandings / tripDuration;
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

    getActiveDays(allGears: FleetReportInterface[]) {
        let numerator = 0
        let denominator = 0

        allGears.forEach(element => {
            numerator = numerator + (element.freq * element.activeDays);
            denominator += element.freq
        })

        return numerator / denominator
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
        let totalCatch = 0
        let sumPrices = 0

        landingsData.forEach(fish => {
            totalCatch += fish.fish.fish_weight
            sumPrices += fish.fish.price * fish.fish.fish_weight
        })

        return sumPrices / totalCatch;
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
            numberOfCatch += element.fish.fish_weight * element.fish.fish_quantity;
        });

        return numberOfCatch / landingsData.length;
    }


    //========================Left Panel=====================================
    async getLeftPanelInfo() {
        const [portsCount, uniqueSpecies, effortRecord, landingRecord, uniqueGears, sampleCatch] = await Promise.all([
            this.getSampledPortsCount(),
            this.getUniqueSpeciesFishedByPeriod(),
            this.getRecordsEffortInPeriod(),
            this.getLandingRecordsByPeriod(),
            this.getAllFishingGears(),
            this.getCatchByPeriod()
        ]);

        // Collect all unique periods from all datasets
        const allPeriods = new Set([
            ...Object.keys(portsCount),
            ...Object.keys(uniqueSpecies),
            ...Object.keys(effortRecord),
            ...Object.keys(landingRecord),
            ...Object.keys(uniqueGears),
            ...Object.keys(sampleCatch)
        ]);

        const dataCombine: Record<string, any> = {};

        allPeriods.forEach(period => {
            dataCombine[period] = {
                strata: portsCount[period] || {port: 0, coop: 0, region: 0},
                speciesKind: uniqueSpecies[period] || 0,
                effortRecord: effortRecord[period] || 0,
                landingRecord: landingRecord[period] || 0,
                totalGears: uniqueGears[period] || 0,
                sampleCatch: sampleCatch[period] || 0
            };
        });

        console.log("Left Panel Data:", dataCombine);

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

    async getAllFishingGears() {
        const periods = await this.prisma.period.findMany({select: {period_date: true}});
        const promises = periods.map((period) => {
            return this.fleetService.generateFleetReport({period: period.period_date.toString()}, period.period_date.getMonth());
        });
        const results = await Promise.all(promises);
        const record: Record<string, number> = {}

        for (let i = 0; i < results.length; i++) {
            let gearsNum = 0;
            for (let j = 0; j < results[i].length; j++) {
                gearsNum += results[i][j].freq;
            }
            record[periods[i].period_date.toDateString()] = gearsNum;
        }

        return record
    }

    async getCatchByPeriod() {
        const form = await this.prisma.landing.findMany({
            select: {
                form: {
                    select: {
                        period_date: true
                    }
                },
                fish: {
                    select: {
                        fish_weight: true,
                        fish_quantity: true
                    }
                }
            }
        })

        const record: Record<string, number> = {};

        form.forEach(val => {
            let totalCatch = 0

            val.fish.forEach(fish => {
                totalCatch = totalCatch + fish.fish_weight * fish.fish_quantity
            })
            record[val.form.period_date.toDateString()] = totalCatch
        })

        return record
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