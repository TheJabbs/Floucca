import { IsString } from 'class-validator';

export class CreateBackupDto {
  @IsString()
  backup_content: string;
  
}
