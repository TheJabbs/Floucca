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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeriodController = void 0;
const common_1 = require("@nestjs/common");
const period_service_1 = require("./period.service");
const update_gear_detail_dto_1 = require("../gear_detail/dto/update_gear_detail.dto");
let PeriodController = class PeriodController {
    constructor(periodService) {
        this.periodService = periodService;
    }
    async getAllPeriod() {
        return this.periodService.getAllPeriod();
    }
    async getPeriodById(periodId) {
        return this.periodService.getPeriodById(periodId);
    }
    async updatePeriod(periodId, updatedPeriod) {
        return this.periodService.updatePeriod(periodId, updatedPeriod);
    }
    async deletePeriod(periodId) {
        return this.periodService.deletePeriod(periodId);
    }
};
exports.PeriodController = PeriodController;
__decorate([
    (0, common_1.Get)('/all/period'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PeriodController.prototype, "getAllPeriod", null);
__decorate([
    (0, common_1.Get)('/period/:period_id'),
    __param(0, (0, common_1.Param)('period_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], PeriodController.prototype, "getPeriodById", null);
__decorate([
    (0, common_1.Put)('/update/period/:period_id'),
    __param(0, (0, common_1.Param)('period_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date, update_gear_detail_dto_1.UpdateGearDetailDto]),
    __metadata("design:returntype", Promise)
], PeriodController.prototype, "updatePeriod", null);
__decorate([
    (0, common_1.Delete)('/delete/period/:period_id'),
    __param(0, (0, common_1.Param)('period_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date]),
    __metadata("design:returntype", Promise)
], PeriodController.prototype, "deletePeriod", null);
exports.PeriodController = PeriodController = __decorate([
    (0, common_1.Controller)('api/dev/period'),
    __metadata("design:paramtypes", [period_service_1.PeriodService])
], PeriodController);
//# sourceMappingURL=period.controller.js.map