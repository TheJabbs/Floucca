"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearUsageModule = void 0;
const common_1 = require("@nestjs/common");
const gear_usage_controller_1 = require("./gear_usage.controller");
const gear_usage_service_1 = require("./gear_usage.service");
let GearUsageModule = class GearUsageModule {
};
exports.GearUsageModule = GearUsageModule;
exports.GearUsageModule = GearUsageModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [gear_usage_controller_1.GearUsageController],
        providers: [gear_usage_service_1.GearUsageService],
    })
], GearUsageModule);
//# sourceMappingURL=gear_usage.module.js.map