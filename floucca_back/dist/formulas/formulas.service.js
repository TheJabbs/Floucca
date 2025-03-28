"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulasService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const fish_service_1 = require("../backend/fish/fish.service");
const landings_service_1 = require("../backend/landings/landings.service");
const sense_lastw_service_1 = require("../backend/sense_lastw/sense_lastw.service");
const getDaysInAMonth_1 = require("../utils/date/getDaysInAMonth");
const gear_service_1 = require("../backend/gear/gear.service");
const mapLandingsAndEffort_mapper_1 = require("./utils/mapLandingsAndEffort.mapper");
const mapEffortMap_mapper_1 = require("./utils/mapEffortMap.mapper");
const mapLandingsMapForSpeciePrice_mapper_1 = require("./utils/mapLandingsMapForSpeciePrice.mapper");
const mapLandingsBySpecie_mapper_1 = require("./utils/mapLandingsBySpecie.mapper");
const mapSpecies_mapper_1 = require("./utils/mapSpecies.mapper");
let FormulasService = class FormulasService {
    constructor(prisma, fishService, landingsService, senseLastWService, gearService) {
        this.prisma = prisma;
        this.fishService = fishService;
        this.landingsService = landingsService;
        this.senseLastWService = senseLastWService;
        this.gearService = gearService;
    }
    async getReport(filter) {
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
        };
    }
    async getEffortAndLanding(effortData, landingData, filter) {
        delete filter.gear_code;
        const [pba, allGears, totalGears] = await Promise.all([
            this.getPba(JSON.parse(JSON.stringify(effortData))),
            this.gearService.getAllGear(),
            this.landingsService.getLandingsByFilter(filter)
        ]);
        const estEffort = await this.getEstimateEffort(pba, effortData, allGears);
        console.log(estEffort);
        const estCatch = await this.getEstimateCatchForAllSpecies(landingData, estEffort);
        const [avgPrice, estValue, cpue, estCatch2, activeDays] = await Promise.all([
            this.getAvgFishPrice(landingData),
            this.getEstimatedSpeciesValue(landingData, estCatch),
            this.getSpeciesCpue(estCatch, estEffort),
            this.getEstimateSpeciesCatch(landingData, estCatch),
            this.getActiveDays(effortData, allGears),
        ]);
        const sampleEffort = await this.getEffortBySpecies(landingData, cpue);
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
        };
    }
    async getSingularFishData(landingData, estTotalCatch, totalEffort) {
        const map = (0, mapSpecies_mapper_1.mapSpeciesMapper)(landingData);
        let fishData = [];
        for (const [specie, count] of map.entries()) {
            const [estCatch, avgPrice, avgFishWeight, avgFishQuantity, avgFishLength, avgFishWeightByKilo, totalCatch] = await Promise.all([
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
    async getCpue(landingData) {
        let fishWeight = 0;
        landingData.forEach(landing => {
            landing.fish.forEach(fish => {
                fishWeight += fish.fish_weight;
            });
        });
        return fishWeight / landingData.length;
    }
    async getEffortBySpecies(data, cpue) {
        const map = (0, mapLandingsBySpecie_mapper_1.mapLandingsBySpecieMapper)(data);
        let sum = 0;
        let count = 0;
        for (const [specie, specieCount] of map.entries()) {
            sum += specie * cpue;
            count += specieCount;
        }
        return count > 0 ? sum / count : 0;
    }
    async getPba(data) {
        let map = (0, mapLandingsAndEffort_mapper_1.mapLandingsAndEffortMapper)(data);
        let speciesMap = (0, mapEffortMap_mapper_1.mapEffortMapMapper)(map);
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
    async getTotalEffort(filter, data, pba) {
        delete filter.gear_code;
        const periodDate = new Date(filter.period);
        const days = (0, getDaysInAMonth_1.getDaysInMonthByDate)(periodDate.toDateString());
        const numberGear = data.length;
        return days * numberGear * pba;
    }
    async getActiveDays(data, allGears) {
        let activeDays = 0;
        data.forEach(effort => {
            activeDays += effort.days_fished;
        });
        return (activeDays * data.length) / allGears.length;
    }
    async getEstimateEffort(pba, data, allGears) {
        const activeDays = await this.getActiveDays(data, allGears);
        return activeDays * allGears.length * pba;
    }
    async getEstimateCatchForAllSpecies(landingData, estEffort) {
        return estEffort * await this.getCpue(landingData);
    }
    async getAvgFishPrice(data) {
        const map = (0, mapLandingsAndEffort_mapper_1.mapLandingsAndEffortMapper)(data);
        const fishMap = (0, mapLandingsMapForSpeciePrice_mapper_1.mapLandingsMapForSpeciePriceMapper)(map);
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
    async getAvgFishWeight(dataLanding) {
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
    async getAvgFishLength(data) {
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
    async getAvgFishQuantity(data) {
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
    async getAvgFishWeightByKilo(data, kg) {
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
    async getEstimateSpeciesCatch(data, estimatedTotalCatch) {
        let sampleSpeciesCatch = 0;
        let sampleTotalCatch = 0;
        data.forEach(landing => {
            landing.fish.forEach(fish => {
                sampleTotalCatch += fish.fish_quantity;
                sampleSpeciesCatch += fish.fish_quantity;
            });
        });
        if (sampleTotalCatch === 0)
            return 0;
        return estimatedTotalCatch * (sampleSpeciesCatch / sampleTotalCatch);
    }
    async getSpeciesCpue(estimatedSpeciesCatch, estimatedTotalEffort) {
        if (estimatedTotalEffort === 0)
            return 0;
        return estimatedSpeciesCatch / estimatedTotalEffort;
    }
    async getEstimatedSpeciesValue(dataLanding, estimatedSpeciesCatch) {
        const [estimatedPrice,] = await Promise.all([
            this.getAvgFishPrice(dataLanding),
        ]);
        return estimatedPrice * estimatedSpeciesCatch;
    }
    async getTotalCatch(landings) {
        let totalCatch = 0;
        landings.forEach(landing => {
            landing.fish.forEach(fish => {
                totalCatch += fish.fish_quantity;
            });
        });
        return totalCatch;
    }
};
exports.FormulasService = FormulasService;
exports.FormulasService = FormulasService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        fish_service_1.FishService,
        landings_service_1.LandingsService,
        sense_lastw_service_1.SenseLastwService,
        gear_service_1.GearService])
], FormulasService);
//# sourceMappingURL=formulas.service.js.map