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
exports.SenseLastwController = void 0;
const common_1 = require("@nestjs/common");
const sense_lastw_service_1 = require("./sense_lastw.service");
const create_sense_lastw_dto_1 = require("./dto/create-sense_lastw.dto");
const update_sense_lastw_dto_1 = require("./dto/update-sense_lastw.dto");
const id_dto_1 = require("../../shared/dto/id.dto");
let SenseLastwController = class SenseLastwController {
    constructor(service) {
        this.service = service;
    }
    getAllSenseLastw() {
        return this.service.getAllSenseLastw();
    }
    getSenseLastwById(sense_lastw_id) {
        return this.service.getSenseLastwById(sense_lastw_id.id);
    }
    createSenseLastw(newSenseLastw) {
        return this.service.createSenseLastw(newSenseLastw);
    }
    deleteSenseLastw(sense_lastw_id) {
        return this.service.deleteSenseLastw(sense_lastw_id.id);
    }
    updateSenseLastw(sense_lastw_id, updatedSenseLastw) {
        return this.service.updateSenseLastw(sense_lastw_id.id, updatedSenseLastw);
    }
};
exports.SenseLastwController = SenseLastwController;
__decorate([
    (0, common_1.Get)('/all/sense_lastw'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SenseLastwController.prototype, "getAllSenseLastw", null);
__decorate([
    (0, common_1.Get)('/sense_lastw/:sense_lastw_id'),
    __param(0, (0, common_1.Param)('sense_lastw_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], SenseLastwController.prototype, "getSenseLastwById", null);
__decorate([
    (0, common_1.Post)('/create/sense_lastw'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_sense_lastw_dto_1.CreateSenseLastwDto]),
    __metadata("design:returntype", void 0)
], SenseLastwController.prototype, "createSenseLastw", null);
__decorate([
    (0, common_1.Delete)('/delete/sense_lastw/:sense_lastw_id'),
    __param(0, (0, common_1.Param)('sense_lastw_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], SenseLastwController.prototype, "deleteSenseLastw", null);
__decorate([
    (0, common_1.Put)('/update/sense_lastw/:sense_lastw_id'),
    __param(0, (0, common_1.Param)('sense_lastw_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO,
        update_sense_lastw_dto_1.UpdateSenseLastwDto]),
    __metadata("design:returntype", void 0)
], SenseLastwController.prototype, "updateSenseLastw", null);
exports.SenseLastwController = SenseLastwController = __decorate([
    (0, common_1.Controller)('api/dev/sense_lastw'),
    __metadata("design:paramtypes", [sense_lastw_service_1.SenseLastwService])
], SenseLastwController);
//# sourceMappingURL=sense_lastw.controller.js.map