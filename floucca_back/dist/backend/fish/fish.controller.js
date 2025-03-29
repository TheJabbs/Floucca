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
exports.FishController = void 0;
const common_1 = require("@nestjs/common");
const fish_service_1 = require("./fish.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const create_fish_dto_1 = require("./dto/create_fish.dto");
const update_fish_dto_1 = require("./dto/update_fish.dto");
let FishController = class FishController {
    constructor(fishService) {
        this.fishService = fishService;
    }
    getAllFish() {
        return this.fishService.getAllFish();
    }
    getFishById(id) {
        return this.fishService.getFishById(id.id);
    }
    createFish(fish) {
        return this.fishService.createFish(fish);
    }
    updateFish(fish, id) {
        return this.fishService.updateFish(id.id, fish);
    }
    deleteFish(id) {
        return this.fishService.deleteFish(id.id);
    }
};
exports.FishController = FishController;
__decorate([
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FishController.prototype, "getAllFish", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], FishController.prototype, "getFishById", null);
__decorate([
    (0, common_1.Post)('/create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fish_dto_1.CreateFishDto]),
    __metadata("design:returntype", void 0)
], FishController.prototype, "createFish", null);
__decorate([
    (0, common_1.Put)('/update/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_fish_dto_1.UpdateFishDto, id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], FishController.prototype, "updateFish", null);
__decorate([
    (0, common_1.Delete)('/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], FishController.prototype, "deleteFish", null);
exports.FishController = FishController = __decorate([
    (0, common_1.Controller)('/api/fish'),
    __metadata("design:paramtypes", [fish_service_1.FishService])
], FishController);
//# sourceMappingURL=fish.controller.js.map