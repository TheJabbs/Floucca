"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const node_cron_1 = require("node-cron");
const client_1 = require("@prisma/client");
let ScheduleService = class ScheduleService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    onModuleInit() {
        this.scheduleGeneratePeriod();
    }
    scheduleGeneratePeriod() {
        (0, node_cron_1.schedule)('0 0 1 * *', async () => {
            try {
                const newPeriod = await this.prisma.period.create({
                    data: { period_date: new Date() },
                });
                console.log('New period created:', newPeriod);
            }
            catch (error) {
                console.error('Error creating new period:', error);
            }
        });
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)()
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map