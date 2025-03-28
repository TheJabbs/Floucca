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
exports.CoopController = void 0;
const common_1 = require("@nestjs/common");
const coop_service_1 = require("./coop.service");
const coop_Dto_1 = require("./dto/coop.Dto");
const coop_mapper_1 = require("./mapper/coop.mapper");
const id_dto_1 = require("../../shared/dto/id.dto");
let CoopController = class CoopController {
    constructor(coopService) {
        this.coopService = coopService;
    }
    getAllCoops() {
        return this.coopService.getAllCoops();
    }
    getCoopById(id) {
        return this.coopService.getCoopById(id.id);
    }
    createCoop(coop) {
        const check = this.coopService.getCoopById(coop.coop_code);
        if (check) {
            return "Coop already exists";
        }
        return this.coopService.createCoop((0, coop_mapper_1.mapCoopToReturnCoopInterface)(coop));
    }
    updateCoop(coop, id) {
        const check = this.coopService.getCoopById(id.id);
        if (!check) {
            return "Coop does not exist";
        }
        return this.coopService.updateCoop(id.id, (0, coop_mapper_1.mapCoopToReturnCoopInterface)(coop));
    }
    deleteCoop(id) {
        const check = this.coopService.getCoopById(id.id);
        if (!check) {
            return "Coop does not exist";
        }
        return this.coopService.deleteCoop(id.id);
    }
};
exports.CoopController = CoopController;
__decorate([
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CoopController.prototype, "getAllCoops", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], CoopController.prototype, "getCoopById", null);
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coop_Dto_1.CoopDto]),
    __metadata("design:returntype", void 0)
], CoopController.prototype, "createCoop", null);
__decorate([
    (0, common_1.Put)('/update/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [coop_Dto_1.CoopDto, id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], CoopController.prototype, "updateCoop", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], CoopController.prototype, "deleteCoop", null);
exports.CoopController = CoopController = __decorate([
    (0, common_1.Controller)('api/coop'),
    __metadata("design:paramtypes", [coop_service_1.CoopService])
], CoopController);
//# sourceMappingURL=coop.controller.js.map