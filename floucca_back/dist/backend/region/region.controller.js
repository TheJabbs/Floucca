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
exports.RegionController = void 0;
const common_1 = require("@nestjs/common");
const region_service_1 = require("./region.service");
const create_region_dto_1 = require("./dto/create-region.dto");
let RegionController = class RegionController {
    constructor(regionService) {
        this.regionService = regionService;
    }
    async createRegion(createRegionDto) {
        return this.regionService.createRegion(createRegionDto);
    }
    async findAllRegions() {
        return this.regionService.findAllRegions();
    }
    async findRegionById(region_code) {
        console.log("Fetching region with code:", region_code);
        return this.regionService.findRegionById(region_code);
    }
    async updateRegion(region_code, updateRegionDto) {
        console.log(`Updating region ${region_code} with data:`, updateRegionDto);
        return this.regionService.updateRegion(region_code, updateRegionDto);
    }
    async deleteRegion(region_code) {
        console.log("Received request to delete region with code:", region_code);
        return this.regionService.deleteRegion(region_code);
    }
};
exports.RegionController = RegionController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_region_dto_1.CreateRegionDto]),
    __metadata("design:returntype", Promise)
], RegionController.prototype, "createRegion", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RegionController.prototype, "findAllRegions", null);
__decorate([
    (0, common_1.Get)(":region_code"),
    __param(0, (0, common_1.Param)("region_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegionController.prototype, "findRegionById", null);
__decorate([
    (0, common_1.Put)("update/:region_code"),
    __param(0, (0, common_1.Param)("region_code")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_region_dto_1.CreateRegionDto]),
    __metadata("design:returntype", Promise)
], RegionController.prototype, "updateRegion", null);
__decorate([
    (0, common_1.Delete)("delete/:region_code"),
    __param(0, (0, common_1.Param)("region_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], RegionController.prototype, "deleteRegion", null);
exports.RegionController = RegionController = __decorate([
    (0, common_1.Controller)("region"),
    __metadata("design:paramtypes", [region_service_1.RegionService])
], RegionController);
//# sourceMappingURL=region.controller.js.map