"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoatDetailsModule = void 0;
const common_1 = require("@nestjs/common");
const boat_detail_service_1 = require("./boat_detail.service");
const boat_detail_controller_1 = require("./boat_detail.controller");
let BoatDetailsModule = class BoatDetailsModule {
};
exports.BoatDetailsModule = BoatDetailsModule;
exports.BoatDetailsModule = BoatDetailsModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [boat_detail_controller_1.BoatDetailsController],
        providers: [boat_detail_service_1.BoatDetailsServices],
    })
], BoatDetailsModule);
//# sourceMappingURL=boat_detail.module.js.map