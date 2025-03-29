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
exports.BoatDetailsController = void 0;
const common_1 = require("@nestjs/common");
const boat_detail_service_1 = require("./boat_detail.service");
const dto_1 = require("./dto");
const id_dto_1 = require("../../shared/dto/id.dto");
let BoatDetailsController = class BoatDetailsController {
    constructor(boatDetailsService) {
        this.boatDetailsService = boatDetailsService;
    }
    getAllBoatDetails() {
        return this.boatDetailsService.getAllBoatDetails();
    }
    getBoatDetailsByBDID(BDID) {
        return this.boatDetailsService.getBoatDetailsByBDID(BDID.id);
    }
    createBoatDetails(newBoatDetails) {
        return this.boatDetailsService.createBoatDetails(newBoatDetails);
    }
    deleteBoatDetails(BDID) {
        return this.boatDetailsService.deleteBoatDetails(BDID.id);
    }
};
exports.BoatDetailsController = BoatDetailsController;
__decorate([
    (0, common_1.Get)('/all/boat_details'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BoatDetailsController.prototype, "getAllBoatDetails", null);
__decorate([
    (0, common_1.Get)('/boat_details/:boat_details_id'),
    __param(0, (0, common_1.Param)('boat_details_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], BoatDetailsController.prototype, "getBoatDetailsByBDID", null);
__decorate([
    (0, common_1.Post)('/create/boat_details'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateBoatDetailsDto]),
    __metadata("design:returntype", void 0)
], BoatDetailsController.prototype, "createBoatDetails", null);
__decorate([
    (0, common_1.Delete)('/delete/boat_details/:boat_details_id'),
    __param(0, (0, common_1.Param)('boat_details_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], BoatDetailsController.prototype, "deleteBoatDetails", null);
exports.BoatDetailsController = BoatDetailsController = __decorate([
    (0, common_1.Controller)('api/dev/boat_details'),
    __metadata("design:paramtypes", [boat_detail_service_1.BoatDetailsServices])
], BoatDetailsController);
//# sourceMappingURL=boat_detail.controller.js.map