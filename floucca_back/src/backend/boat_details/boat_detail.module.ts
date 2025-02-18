import { Module } from '@nestjs/common';
import { BoatDetailsServices } from './boat_detail.service';
import { BoatDetailsController } from './boat_detail.controller';

@Module({
  imports: [], // Later lal jwt authentication
  controllers: [BoatDetailsController],
  providers: [BoatDetailsServices],
})
export class BoatDetailsModule {}
