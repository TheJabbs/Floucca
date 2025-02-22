import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBoatDetailsDto } from './dto';
import {GetAllBoatDetailsInterface} from "./interface";
import {ResponseMessage} from "../../shared/interface/response.interface";

@Injectable()
export class BoatDetailsServices {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBoatDetails(): Promise<GetAllBoatDetailsInterface[]> {
    const boat_details = await this.prisma.boat_details.findMany({
      select: {
        boat_id: true,
        fleet_owner: true,
        fleet_size: true,
        fleet_crew: true,
        fleet_max_weight: true,
        fleet_length: true,
        fleet_registration: true,
      },
    });

    if (!boat_details || boat_details.length === 0) {
      throw new NotFoundException('No boat details found');
    }

    return boat_details;
  }

async getBoatDetailsByBDID(
  boat_details_id: number,
): Promise<GetAllBoatDetailsInterface> {
  console.log(boat_details_id);
  const boat_details = await this.prisma.boat_details.findUnique({
    where: {
      boat_id: boat_details_id,
    },
    select: {
      boat_id: true,
      fleet_owner: true,
      fleet_size: true,
      fleet_crew: true,
      fleet_max_weight: true,
      fleet_length: true,
      fleet_registration: true,
    },
  });

  if (!boat_details) {
    throw new NotFoundException('Boat details not found');
  }

  return boat_details;
}

  async getBoatDetailByFleetOwner(
    fleet_owner: string,
  ): Promise<GetAllBoatDetailsInterface> {
    const boat_details = await this.prisma.boat_details.findFirst({
      where: { fleet_owner: fleet_owner },
      select: {
        boat_id: true,
        fleet_owner: true,
        fleet_size: true,
        fleet_crew: true,
        fleet_max_weight: true,
        fleet_length: true,
        fleet_registration: true,
      },
    });

    return boat_details;
  }

  async createBoatDetails(
    newBoatDetails: CreateBoatDetailsDto,
  ): Promise<ResponseMessage<any>> {
    const boat = await this.prisma.boat_details.create({
      data: newBoatDetails
    })

    return {
      message: 'Boat details created successfully',
      data: boat
    };
  }

  async updateBoatDetails() {} // Bede es2al charbel 3an chaghle abel ma na3mela.

  async deleteBoatDetails(
    BoatDetailsId: number,
  ): Promise<ResponseMessage<any>> {
    const boatDetails = await this.prisma.boat_details.findUnique({
      where: { boat_id: BoatDetailsId },
    });

    if (!boatDetails) {
      throw new NotFoundException('Boat details not found');
    }

    await this.prisma.boat_details.delete({
      where: { boat_id: BoatDetailsId },
    });

    return {
      message: 'Boat details deleted successfully'
    };
  }

  // ----------------------------- Utility Functions ----------------------------- //
  private async validateIds(
    fleetSensesIds: number[],
    landingIds: number[],
  ): Promise<void> {
    const [validFleetSenses, validLanding] = await Promise.all([
      this.prisma.fleet_senses.findMany({
        where: {
          fleet_senses_id: { in: fleetSensesIds },
        },
      }),
      this.prisma.landing.findMany({
        where: {
          landing_id: { in: landingIds },
        },
      }),
    ]);

    if (validFleetSenses.length !== fleetSensesIds.length) {
      throw new Error('One or more fleet senses IDs are invalid');
    }

    if (validLanding.length !== landingIds.length) {
      throw new Error('One or more landing IDs are invalid');
    }
  }
}
