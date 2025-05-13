import { Module } from '@nestjs/common';
import {ScheduleService} from "./schedule.service";
import {BackupModule} from "../backend/backup/backup.module";

@Module({
  providers: [ScheduleService],
  imports: [BackupModule],
})
export class ScheduleModule {}