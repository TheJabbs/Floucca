import { Module } from '@nestjs/common';
import {PrismaModule} from "./prisma/prisma.module";
import {CoopModule} from "./backend/coop/coop.module";
import {BoatDetailsModule} from "./backend/boat_details/boat_detail.module";
import {EffortTodayModule} from "./backend/effort_today/effort_today.module";
import {FishModule} from "./backend/fish/fish.module";
import {FleetModule} from "./backend/fleet_senses/fleet.module";
import {FormModule} from "./backend/form/form.module";
import {GearModule} from "./backend/gear/gear.module";
import {GearUsageModule} from "./backend/gear_usage/gear_usage.module";
import {GearDetailModule} from "./backend/gear_detail/gear_detail.module";
import {ScheduleModule} from "./auto/schedule.module";
import {SenseLastwModule} from "./backend/sense_lastw/sense_lastw.module";
import {LandingsModule} from "./backend/landings/landings.module";
import { PortsModule } from './backend/ports/ports.module';
import { RegionModule } from './backend/region/region.module';
import { RoleModule } from './backend/role/role.module';
import { SpecieModule } from './backend/species/species.module';
import { UserRoleModule } from './backend/user_role/user_role.module';
import { UserCoopModule } from './backend/user_coop/user_coop.module';
import {FormulasModule} from "./formulas/formulas.module";
import { UserModule } from './backend/users/users.module';
import { ConfigModule } from '@nestjs/config';
import {PeriodModule} from "./backend/period/period.module";

@Module({
  imports: [PrismaModule, CoopModule, BoatDetailsModule,
    EffortTodayModule, FishModule, FishModule, FleetModule,
    FormModule, GearModule, GearUsageModule, GearDetailModule,
  ScheduleModule, SenseLastwModule, LandingsModule, PortsModule,
  RegionModule, RoleModule, SpecieModule, UserRoleModule, 
  UserCoopModule,PeriodModule, FormulasModule, UserModule, ConfigModule.forRoot()],
  providers: [],
})
export class AppModule {}
