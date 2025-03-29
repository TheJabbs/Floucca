"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GearModule = void 0;
const common_1 = require("@nestjs/common");
const gear_controller_1 = require("./gear.controller");
const gear_service_1 = require("./gear.service");
let GearModule = class GearModule {
};
exports.GearModule = GearModule;
exports.GearModule = GearModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [gear_controller_1.GearController],
        providers: [gear_service_1.GearService],
        exports: [gear_service_1.GearService]
    })
], GearModule);
//# sourceMappingURL=gear.module.js.map