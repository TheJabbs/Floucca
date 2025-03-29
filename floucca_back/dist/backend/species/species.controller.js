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
exports.SpecieController = void 0;
const common_1 = require("@nestjs/common");
const species_service_1 = require("./species.service");
const create_species_dto_1 = require("./dto/create-species.dto");
let SpecieController = class SpecieController {
    constructor(specieService) {
        this.specieService = specieService;
    }
    async createSpecie(createSpecieDto) {
        return this.specieService.createSpecie(createSpecieDto);
    }
    async findAllSpecies() {
        return this.specieService.findAllSpecies();
    }
    async findSpecieById(specie_code) {
        return this.specieService.findSpecieById(Number(specie_code));
    }
    async updateSpecie(specie_code, updateSpecieDto) {
        return this.specieService.updateSpecie(Number(specie_code), updateSpecieDto);
    }
    async deleteSpecie(specie_code) {
        return this.specieService.deleteSpecie(Number(specie_code));
    }
};
exports.SpecieController = SpecieController;
__decorate([
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_species_dto_1.CreateSpecieDto]),
    __metadata("design:returntype", Promise)
], SpecieController.prototype, "createSpecie", null);
__decorate([
    (0, common_1.Get)("all"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpecieController.prototype, "findAllSpecies", null);
__decorate([
    (0, common_1.Get)(":specie_code"),
    __param(0, (0, common_1.Param)("specie_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpecieController.prototype, "findSpecieById", null);
__decorate([
    (0, common_1.Put)("update/:specie_code"),
    __param(0, (0, common_1.Param)("specie_code")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_species_dto_1.CreateSpecieDto]),
    __metadata("design:returntype", Promise)
], SpecieController.prototype, "updateSpecie", null);
__decorate([
    (0, common_1.Delete)("delete/:specie_code"),
    __param(0, (0, common_1.Param)("specie_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SpecieController.prototype, "deleteSpecie", null);
exports.SpecieController = SpecieController = __decorate([
    (0, common_1.Controller)("species"),
    __metadata("design:paramtypes", [species_service_1.SpecieService])
], SpecieController);
//# sourceMappingURL=species.controller.js.map