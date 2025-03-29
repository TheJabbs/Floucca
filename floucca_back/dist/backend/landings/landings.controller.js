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
exports.LandingsController = void 0;
const common_1 = require("@nestjs/common");
const landings_service_1 = require("./landings.service");
const id_dto_1 = require("../../shared/dto/id.dto");
const createLandings_dto_1 = require("./dto/createLandings.dto");
const updateLandings_dto_1 = require("./dto/updateLandings.dto");
const CreateFormLanding_dto_1 = require("./dto/CreateFormLanding.dto");
let LandingsController = class LandingsController {
    constructor(service) {
        this.service = service;
    }
    getAllLandings() {
        return this.service.getAllLandings();
    }
    getLandingById(landing_id) {
        return this.service.getLandingById(landing_id.id);
    }
    createLanding(newLanding) {
        return this.service.createLanding(newLanding);
    }
    deleteLanding(landing_id) {
        return this.service.deleteLanding(landing_id.id);
    }
    updateLanding(landing_id, updatedLanding) {
        return this.service.updateLanding(landing_id.id, updatedLanding);
    }
    createFormLanding(formLanding) {
        return this.service.createLandingForm(formLanding);
    }
};
exports.LandingsController = LandingsController;
__decorate([
    (0, common_1.Get)("/all/landings"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], LandingsController.prototype, "getAllLandings", null);
__decorate([
    (0, common_1.Get)("/landings/:landing_id"),
    __param(0, (0, common_1.Param)("landing_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], LandingsController.prototype, "getLandingById", null);
__decorate([
    (0, common_1.Post)("/create/landings"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createLandings_dto_1.CreateLandingDto]),
    __metadata("design:returntype", void 0)
], LandingsController.prototype, "createLanding", null);
__decorate([
    (0, common_1.Delete)("/delete/landings/:landing_id"),
    __param(0, (0, common_1.Param)("landing_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], LandingsController.prototype, "deleteLanding", null);
__decorate([
    (0, common_1.Put)("/update/landings/:landing_id"),
    __param(0, (0, common_1.Param)("landing_id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, updateLandings_dto_1.UpdateLandingsDto]),
    __metadata("design:returntype", void 0)
], LandingsController.prototype, "updateLanding", null);
__decorate([
    (0, common_1.Post)("/create/form"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFormLanding_dto_1.CreateFormLandingDto]),
    __metadata("design:returntype", void 0)
], LandingsController.prototype, "createFormLanding", null);
exports.LandingsController = LandingsController = __decorate([
    (0, common_1.Controller)("api/dev/landings"),
    __metadata("design:paramtypes", [landings_service_1.LandingsService])
], LandingsController);
//# sourceMappingURL=landings.controller.js.map