import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBackupDto } from './dto/create-backup.dto';
import { Backup } from './interfaces/backup.interface';

@Injectable()
export class BackupService {
  constructor(private prisma: PrismaService) {}

async createBackup(dto: CreateBackupDto): Promise<Backup> {
    return this.prisma.backup.create({
      data: {
        backup_content: dto.backup_content,
        backup_date: new Date(),
      },
    });
  }
  
  async getAllBackups(): Promise<Backup[]> {
    return this.prisma.backup.findMany({ orderBy: { backup_date: 'desc' } });
  }

  async getBackupById(id: number): Promise<Backup> {
    const backup = await this.prisma.backup.findUnique({ where: { backup_id: id } });
    if (!backup) throw new NotFoundException(`Backup with ID ${id} not found`);
    return backup;
  }

  async deleteBackup(id: number): Promise<Backup> {
    await this.getBackupById(id); 
    return this.prisma.backup.delete({ where: { backup_id: id } });
  }
}
