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
exports.FleetTesterController = void 0;
const common_1 = require("@nestjs/common");
const fleet_service_1 = require("../fleet.service");
const formGearUsageToGearUsage_mapper_1 = require("../../../utils/transformation/formGearUsageToGearUsage.mapper");
let FleetTesterController = class FleetTesterController {
    constructor(fleetService) {
        this.fleetService = fleetService;
    }
    async createSenseForm(test) {
        const tester = (0, formGearUsageToGearUsage_mapper_1.transformFormGearUsageToGearUsage)(test);
        console.log(tester);
    }
};
exports.FleetTesterController = FleetTesterController;
__decorate([
    (0, common_1.Post)("/gu"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], FleetTesterController.prototype, "createSenseForm", null);
exports.FleetTesterController = FleetTesterController = __decorate([
    (0, common_1.Controller)('api/dev/test/fleet_senses'),
    __metadata("design:paramtypes", [fleet_service_1.FleetService])
], FleetTesterController);
//# sourceMappingURL=fleet.test.js.map