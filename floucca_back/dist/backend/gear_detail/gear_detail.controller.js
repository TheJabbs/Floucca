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
exports.GearDetailController = void 0;
const common_1 = require("@nestjs/common");
const create_gear_detail_dto_1 = require("./dto/create_gear_detail.dto");
const gear_detail_service_1 = require("./gear_detail.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const update_gear_detail_dto_1 = require("./dto/update_gear_detail.dto");
let GearDetailController = class GearDetailController {
    constructor(service) {
        this.service = service;
    }
    getAllGearDetail() {
        return this.service.getAllGearDetail();
    }
    getGearDetailByCode(gear_detail_code) {
        return this.service.getGearDetailById(gear_detail_code.id);
    }
    createGearDetail(newGearDetail) {
        return this.service.createGearDetail(newGearDetail);
    }
    deleteGearDetail(gear_detail_code) {
        return this.service.deleteGearDetail(gear_detail_code.id);
    }
    updateGearDetail(gear_detail_code, updatedGearDetail) {
        return this.service.updateGearDetail(gear_detail_code.id, updatedGearDetail);
    }
};
exports.GearDetailController = GearDetailController;
__decorate([
    (0, common_1.Get)("/all/gear_detail"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GearDetailController.prototype, "getAllGearDetail", null);
__decorate([
    (0, common_1.Get)("/gear_detail/:gear_detail_code"),
    __param(0, (0, common_1.Param)("gear_detail_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], GearDetailController.prototype, "getGearDetailByCode", null);
__decorate([
    (0, common_1.Post)("/create/gear_detail"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gear_detail_dto_1.CreateGearDetailDto]),
    __metadata("design:returntype", void 0)
], GearDetailController.prototype, "createGearDetail", null);
__decorate([
    (0, common_1.Delete)("/delete/gear_detail/:gear_detail_code"),
    __param(0, (0, common_1.Param)("gear_detail_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], GearDetailController.prototype, "deleteGearDetail", null);
__decorate([
    (0, common_1.Put)("/update/gear_detail/:gear_detail_code"),
    __param(0, (0, common_1.Param)("gear_detail_code")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, update_gear_detail_dto_1.UpdateGearDetailDto]),
    __metadata("design:returntype", void 0)
], GearDetailController.prototype, "updateGearDetail", null);
exports.GearDetailController = GearDetailController = __decorate([
    (0, common_1.Controller)("api/dev/gear_detail"),
    __metadata("design:paramtypes", [gear_detail_service_1.GearDetailService])
], GearDetailController);
//# sourceMappingURL=gear_detail.controller.js.map