import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from 'src/prisma/prisma.service';
import {CreateBackupDto} from './dto/create-backup.dto';
import mysqldump from 'mysqldump';
import mysql from 'mysql2/promise';
import {Backup} from "./interface/backup.interface";

@Injectable()
export class BackupService {
    constructor(private prisma: PrismaService) {
    }

    async getBackupInfo(){
        return this.prisma.backup.findMany({
            select: {
                backup_id: true,
                backup_date: true,
            },
            orderBy: {
                backup_date: 'desc'
            }
        });
    }

    async createBackup(dto: CreateBackupDto): Promise<Backup> {
        return this.prisma.backup.create({
            data: {
                backup_content: dto.backup_content,
                backup_date: new Date(),
            },
        });
    }

    async getAllBackups(): Promise<Backup[]> {
        return this.prisma.backup.findMany({orderBy: {backup_date: 'desc'}});
    }

    async getBackupById(id: number): Promise<Backup> {
        const backup = await this.prisma.backup.findUnique({where: {backup_id: id}});
        if (!backup) throw new NotFoundException(`Backup with ID ${id} not found`);
        return backup;
    }

    async deleteBackup(id: number): Promise<Backup> {
        await this.getBackupById(id);
        return this.prisma.backup.delete({where: {backup_id: id}});
    }

    async dumpAndSaveBackup() {
        try {
            const tables: any[] = await this.prisma.$queryRawUnsafe('SHOW TABLES');
            const tableKey = Object.keys(tables[0])[0];
            const allTables = tables.map((row) => row[tableKey]);
            const tablesToDump = allTables.filter((table) => table !== 'backup');

            const dumpResult = await mysqldump({
                connection: {
                    host: process.env.HOST,
                    user: process.env.USER,
                    password: process.env.PASSWORD,
                    database: process.env.DATABASE,
                },
                //make it ignore table backup in the db during the dump
                dump: {
                    tables: tablesToDump,
                }

            });

            return this.createBackup({
                backup_content: dumpResult.dump.data
            })

        } catch (error) {
            console.error('Error during backup:', error);
        }
    }

    async restoreBackupByIdSoft(backupId: number) {
        try {
            const backup = await this.prisma.backup.findUnique({
                where: {backup_id: backupId},
            });

            if (!backup || !backup.backup_content) {
                throw new Error('Backup not found or empty.');
            }

            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                multipleStatements: true,
            });

            await connection.query(backup.backup_content);
            await connection.end();

            console.log(`Soft restore from backup ID ${backupId} completed.`);
            return {message: 'Soft restore complete'};
        } catch (error) {
            console.error('Soft restore failed', error);
            throw error;
        }
    }

    async restoreBackupByIdHard(backupId: number) {
        try {
            const backup = await this.prisma.backup.findUnique({
                where: {backup_id: backupId},
            });

            if (!backup || !backup.backup_content) {
                throw new Error('Backup not found or empty.');
            }

            const connection = await mysql.createConnection({
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                multipleStatements: true,
            });

            const [tables]: [any[], any] = await connection.query(`SHOW TABLES`);
            const dbNameKey = Object.keys(tables[0])[0];
            const tableNames = tables
                .map((t: Record<string, any>) => t[dbNameKey])
                .filter((name: string) => name !== 'backup');

            const dropStatements = tableNames.map(name => `DROP TABLE IF EXISTS \`${name}\`;`).join('\n');
            await connection.query(`
        SET FOREIGN_KEY_CHECKS = 0;
        ${dropStatements}
        SET FOREIGN_KEY_CHECKS = 1;
        ${backup.backup_content}
      `);
            await connection.query(`
        SET FOREIGN_KEY_CHECKS = 0;
        ${dropStatements}
        SET FOREIGN_KEY_CHECKS = 1;
        ${backup.backup_content}
      `);
            await connection.end();

            console.log(`Hard restore (rollback) from backup ID ${backupId} completed.`);
            return {message: 'Hard restore complete (rollback)'};
        } catch (error) {
            console.error('Hard restore failed', error);
            throw error;
        }
    }
}

