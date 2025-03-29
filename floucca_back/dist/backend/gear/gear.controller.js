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
exports.GearController = void 0;
const common_1 = require("@nestjs/common");
const gear_service_1 = require("./gear.service");
const gear_id_dto_1 = require("./dto/gear_id.dto");
const create_gear_dto_1 = require("./dto/create_gear.dto");
let GearController = class GearController {
    constructor(service) {
        this.service = service;
    }
    getAllGear() {
        return this.service.getAllGear();
    }
    getGearByCode(gear_code) {
        return this.service.getGearById(gear_code.gear_id);
    }
    createGear(newGear) {
        return this.service.createGear(newGear);
    }
    deleteGear(gear_code) {
        return this.service.deleteGear(gear_code.gear_id);
    }
    updateGear(gear_code, updatedGear) {
        return this.service.updateGear(gear_code.gear_id, updatedGear);
    }
};
exports.GearController = GearController;
__decorate([
    (0, common_1.Get)("/all/gear"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GearController.prototype, "getAllGear", null);
__decorate([
    (0, common_1.Get)("/gear/:gear_code"),
    __param(0, (0, common_1.Param)("gear_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gear_id_dto_1.GearIdDto]),
    __metadata("design:returntype", void 0)
], GearController.prototype, "getGearByCode", null);
__decorate([
    (0, common_1.Post)("/create/gear"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gear_dto_1.CreateGearDto]),
    __metadata("design:returntype", void 0)
], GearController.prototype, "createGear", null);
__decorate([
    (0, common_1.Delete)("/delete/gear/:gear_code"),
    __param(0, (0, common_1.Param)("gear_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gear_id_dto_1.GearIdDto]),
    __metadata("design:returntype", void 0)
], GearController.prototype, "deleteGear", null);
__decorate([
    (0, common_1.Put)("/update/gear/:gear_code"),
    __param(0, (0, common_1.Param)("gear_code")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [gear_id_dto_1.GearIdDto, create_gear_dto_1.CreateGearDto]),
    __metadata("design:returntype", void 0)
], GearController.prototype, "updateGear", null);
exports.GearController = GearController = __decorate([
    (0, common_1.Controller)("api/dev/gear"),
    __metadata("design:paramtypes", [gear_service_1.GearService])
], GearController);
//# sourceMappingURL=gear.controller.js.map