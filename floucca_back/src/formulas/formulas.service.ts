import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {FishService} from "../backend/fish/fish.service";
import {LandingsService} from "../backend/landings/landings.service";
import {SenseLastwService} from "../backend/sense_lastw/sense_lastw.service";
import {GeneralFilterDto} from "../shared/dto/GeneralFilter.dto";
import {idDTO} from "../shared/dto/id.dto";
import {getDaysInMonthByDate} from "../utils/date/getDaysInAMonth";
import {GearService} from "../backend/gear/gear.service";

@Injectable()
export class FormulasService {
    constructor(private readonly prisma: PrismaService,
                private readonly fishService: FishService,
                private readonly landingsService: LandingsService,
                private readonly senseLastWService: SenseLastwService,
                private readonly gearService: GearService) {
    }

    async getCpue(filter: GeneralFilterDto) {
        const landings = await this.landingsService.getLandingsByFilter(filter);
        let fishWeight = 0

        landings.forEach(landing => {
            landing.fish.forEach(fish => {
                fishWeight += fish.fish_weight
            })
        })

        return (fishWeight/landings.length)
    }

    async getEffortBySpecies(filter: GeneralFilterDto, code: idDTO) {
        const cpue = await this.getCpue(filter);
        const fishes = await this.fishService.getAllFishByFilter(filter, code);

        let fishWeight = 0
        fishes.forEach(fish => {
            fishWeight += fish.fish_weight
        })

        return fishWeight/cpue
    }

    async getPba(filter: GeneralFilterDto) {
        const data = await this.senseLastWService.getEffortsByFilter(filter);

        let daysExamined = data.length * 7;
        let daysFished = 0;

        data.forEach((effort) => {
            daysFished += effort.days_fished;
        });

        return (daysFished / daysExamined)
    }

    async getTotalEffort(filter: GeneralFilterDto) {
        delete filter.gear_code;

        const data = await this.senseLastWService.getEffortsByFilter(filter);

        const pba = await this.getPba(filter);
        const periodDate = new Date(filter.period);
        const days = getDaysInMonthByDate(periodDate.toDateString());
        const numberGear = data.length;

        return (days * numberGear * pba)
    }

    async getActiveDays(filter: GeneralFilterDto) {
        const data = await this.senseLastWService.getEffortsByFilter(filter);
        const allGears = await this.gearService.getAllGear();

        let activeDays = 0;
        data.forEach((effort) => {
            activeDays += effort.days_fished;
        });

        return activeDays * data.length/allGears.length;
    }

    async getEstimateEffort(filter: GeneralFilterDto) {
        const activeDays = await this.getActiveDays(filter);
        const allGears = await this.gearService.getAllGear();
        const pba = await this.getPba(filter);

        return activeDays * allGears.length * pba;
    }
    async getEstimateCatch( filter: GeneralFilterDto){
            delete filter.gear_code

            return await this.getEstimateEffort(filter) * await this.getCpue(filter);
        }
}