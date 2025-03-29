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
exports.EffortTodayController = void 0;
const effort_today_service_1 = require("./effort_today.service");
const common_1 = require("@nestjs/common");
const effort_today_dto_1 = require("./dto/effort_today.dto");
const id_dto_1 = require("../../shared/dto/id.dto");
const updateEffort_dto_1 = require("./dto/updateEffort.dto");
let EffortTodayController = class EffortTodayController {
    constructor(effortTodayService) {
        this.effortTodayService = effortTodayService;
    }
    getAllEffortToday() {
        return this.effortTodayService.getAllEffortToday();
    }
    getEffortTodayById(id) {
        return this.effortTodayService.getEffortTodayById(id.id);
    }
    createEffortToday(effort_today) {
        return this.effortTodayService.createEffortToday(effort_today);
    }
    updateEffortToday(effort_today, id) {
        const check = this.effortTodayService.getEffortTodayById(id.id);
        if (!check) {
            return "Effort today does not exist";
        }
        return this.effortTodayService.updateEffortToday(id.id, effort_today);
    }
    deleteEffortToday(id) {
        const check = this.effortTodayService.getEffortTodayById(id.id);
        if (!check) {
            return "Effort today does not exist";
        }
        return this.effortTodayService.deleteEffortToday(id.id);
    }
};
exports.EffortTodayController = EffortTodayController;
__decorate([
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EffortTodayController.prototype, "getAllEffortToday", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], EffortTodayController.prototype, "getEffortTodayById", null);
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [effort_today_dto_1.CreateEffortTodayDto]),
    __metadata("design:returntype", void 0)
], EffortTodayController.prototype, "createEffortToday", null);
__decorate([
    (0, common_1.Put)('/update/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateEffort_dto_1.UpdateEffortDto, id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], EffortTodayController.prototype, "updateEffortToday", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], EffortTodayController.prototype, "deleteEffortToday", null);
exports.EffortTodayController = EffortTodayController = __decorate([
    (0, common_1.Controller)('api/effort_today'),
    __metadata("design:paramtypes", [effort_today_service_1.EffortTodayService])
], EffortTodayController);
//# sourceMappingURL=effort_today.controller.js.map