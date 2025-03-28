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
exports.FleetController = void 0;
const common_1 = require("@nestjs/common");
const fleet_service_1 = require("./fleet.service");
const DTO_1 = require("./DTO");
const id_dto_1 = require("../../shared/dto/id.dto");
const CreateFleetForm_dto_1 = require("./DTO/CreateFleetForm.dto");
const formGearUsageToGearUsage_mapper_1 = require("../../utils/transformation/formGearUsageToGearUsage.mapper");
let FleetController = class FleetController {
    constructor(fleetService) {
        this.fleetService = fleetService;
    }
    getAllFleetSenses() {
        return this.fleetService.getAllFleet();
    }
    getFleetSensesByFSID(FSID) {
        return this.fleetService.getFleetById(FSID.id);
    }
    getAllFleetByDate(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        return this.fleetService.getAllFleetByDate(startDate, endDate);
    }
    createFleetSenses(newFleet) {
        return this.fleetService.createFleet(newFleet);
    }
    deleteFleetSenses(FSID) {
        return this.fleetService.deleteFleet(FSID.id);
    }
    updateFleetSenses(FSID, updatedFleet) {
        return this.fleetService.updateFleet(FSID.id, updatedFleet);
    }
    createSenseForm(senseForm) {
        const form = senseForm.formDto;
        const boatDetails = senseForm.boatDetailDto;
        console.log(JSON.stringify(senseForm, null, 2));
        const gearUsage = (0, formGearUsageToGearUsage_mapper_1.transformFormGearUsageToGearUsage)(senseForm.gearUsageDto);
        const senseFormContent = {
            form: form,
            boatDetails: boatDetails,
            gearUsage: gearUsage
        };
        return this.fleetService.createFleetSensesForm(senseFormContent);
    }
};
exports.FleetController = FleetController;
__decorate([
    (0, common_1.Get)('/all/fleet_senses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getAllFleetSenses", null);
__decorate([
    (0, common_1.Get)('/fleet_senses/:fleet_senses_id'),
    __param(0, (0, common_1.Param)('fleet_senses_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getFleetSensesByFSID", null);
__decorate([
    (0, common_1.Get)('/fleet_senses/gear_usage/:start/:end'),
    __param(0, (0, common_1.Param)('start')),
    __param(1, (0, common_1.Param)('end')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "getAllFleetByDate", null);
__decorate([
    (0, common_1.Post)('/create/fleet_senses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTO_1.CreateFleetDto]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "createFleetSenses", null);
__decorate([
    (0, common_1.Delete)('/delete/fleet_senses/:fleet_senses_id'),
    __param(0, (0, common_1.Param)('fleet_senses_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "deleteFleetSenses", null);
__decorate([
    (0, common_1.Put)('/update/fleet_senses/:fleet_senses_id'),
    __param(0, (0, common_1.Param)('fleet_senses_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, DTO_1.CreateFleetDto]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "updateFleetSenses", null);
__decorate([
    (0, common_1.Post)("/form/create"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateFleetForm_dto_1.CreateFleetFormDto]),
    __metadata("design:returntype", void 0)
], FleetController.prototype, "createSenseForm", null);
exports.FleetController = FleetController = __decorate([
    (0, common_1.Controller)('api/dev/fleet_senses'),
    __metadata("design:paramtypes", [fleet_service_1.FleetService])
], FleetController);
//# sourceMappingURL=fleet.controller.js.map