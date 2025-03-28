"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormulasModule = void 0;
const common_1 = require("@nestjs/common");
const formulas_controller_1 = require("./formulas.controller");
const formulas_service_1 = require("./formulas.service");
const fish_module_1 = require("../backend/fish/fish.module");
const landings_module_1 = require("../backend/landings/landings.module");
const sense_lastw_module_1 = require("../backend/sense_lastw/sense_lastw.module");
const gear_module_1 = require("../backend/gear/gear.module");
let FormulasModule = class FormulasModule {
};
exports.FormulasModule = FormulasModule;
exports.FormulasModule = FormulasModule = __decorate([
    (0, common_1.Module)({
        imports: [fish_module_1.FishModule, landings_module_1.LandingsModule, sense_lastw_module_1.SenseLastwModule, gear_module_1.GearModule],
        controllers: [formulas_controller_1.FormulasController],
        providers: [formulas_service_1.FormulasService],
    })
], FormulasModule);
//# sourceMappingURL=formulas.module.js.map