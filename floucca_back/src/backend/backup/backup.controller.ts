import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { BackupService } from './backup.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import {Backup} from "./interface/backup.interface";

@Controller('api/dev/backup')
export class BackupController {
  constructor(private readonly service: BackupService) {}

  @Post()
  create(@Body() dto: CreateBackupDto): Promise<Backup> {
    return this.service.createBackup(dto);
  }

  @Get()
  findAll(): Promise<Backup[]> {
    return this.service.getAllBackups();
  }

  @Get('info')
    async getBackupInfo() {
        return this.service.getBackupInfo();
    }

  @Get('up')
  async dumpAndSaveBackup() {
    return this.service.dumpAndSaveBackup();
  }

  @Get('softRestore/:id')
  async softRestore(@Param('id') id: number) {
    return this.service.restoreBackupByIdSoft(+id);
  }

  @Get('fullRestore/:id')
    async fullRestore(@Param('id') id: number) {
        return this.service.restoreBackupByIdHard(+id);
    }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Backup> {
    return this.service.getBackupById(+id);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<Backup> {
    return this.service.deleteBackup(+id);
  }


}
