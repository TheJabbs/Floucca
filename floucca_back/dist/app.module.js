"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const coop_module_1 = require("./backend/coop/coop.module");
const boat_detail_module_1 = require("./backend/boat_details/boat_detail.module");
const effort_today_module_1 = require("./backend/effort_today/effort_today.module");
const fish_module_1 = require("./backend/fish/fish.module");
const fleet_module_1 = require("./backend/fleet_senses/fleet.module");
const form_module_1 = require("./backend/form/form.module");
const gear_module_1 = require("./backend/gear/gear.module");
const gear_usage_module_1 = require("./backend/gear_usage/gear_usage.module");
const gear_detail_module_1 = require("./backend/gear_detail/gear_detail.module");
const schedule_module_1 = require("./auto/schedule.module");
const sense_lastw_module_1 = require("./backend/sense_lastw/sense_lastw.module");
const landings_module_1 = require("./backend/landings/landings.module");
const ports_module_1 = require("./backend/ports/ports.module");
const region_module_1 = require("./backend/region/region.module");
const role_module_1 = require("./backend/role/role.module");
const species_module_1 = require("./backend/species/species.module");
const user_role_module_1 = require("./backend/user_role/user_role.module");
const user_coop_module_1 = require("./backend/user_coop/user_coop.module");
const formulas_module_1 = require("./formulas/formulas.module");
const users_module_1 = require("./backend/users/users.module");
const config_1 = require("@nestjs/config");
const period_module_1 = require("./backend/period/period.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, coop_module_1.CoopModule, boat_detail_module_1.BoatDetailsModule,
            effort_today_module_1.EffortTodayModule, fish_module_1.FishModule, fish_module_1.FishModule, fleet_module_1.FleetModule,
            form_module_1.FormModule, gear_module_1.GearModule, gear_usage_module_1.GearUsageModule, gear_detail_module_1.GearDetailModule,
            schedule_module_1.ScheduleModule, sense_lastw_module_1.SenseLastwModule, landings_module_1.LandingsModule, ports_module_1.PortsModule,
            region_module_1.RegionModule, role_module_1.RoleModule, species_module_1.SpecieModule, user_role_module_1.UserRoleModule,
            user_coop_module_1.UserCoopModule, period_module_1.PeriodModule, formulas_module_1.FormulasModule, users_module_1.UserModule, config_1.ConfigModule.forRoot()],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map