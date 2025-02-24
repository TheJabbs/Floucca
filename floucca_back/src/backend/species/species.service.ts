import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateSpecieDto } from "./dto/create-species.dto";
import { Specie } from "./interfaces/species.interface";

@Injectable()
export class SpecieService {
  constructor(private prisma: PrismaService) {}

  async validateSpecie(specie_code: number, checkExists = true): Promise<void> {
    const specie = await this.prisma.specie.findUnique({
      where: { specie_code },
    });

    if (checkExists && !specie) {
      throw new NotFoundException(`Specie with code ${specie_code} not found.`);
    }

    if (!checkExists && specie) {
      throw new ConflictException(`Specie with code ${specie_code} already exists.`);
    }
  }

  async createSpecie(createSpecieDto: CreateSpecieDto): Promise<Specie> {
    console.log("Received data for creation:", createSpecieDto);

    await this.validateSpecie(createSpecieDto.specie_code, false); // Ensure it doesn't exist

    return this.prisma.specie.create({
      data: createSpecieDto,
    });
  }

  async findAllSpecies(): Promise<Specie[]> {
    return this.prisma.specie.findMany();
  }

  async findSpecieById(specie_code: number): Promise<Specie | null> {
    await this.validateSpecie(specie_code);
    return this.prisma.specie.findUnique({
      where: { specie_code },
    });
  }

  async updateSpecie(specie_code: number, updateSpecieDto: CreateSpecieDto): Promise<Specie> {
    console.log("Received data for update:", updateSpecieDto);

    await this.validateSpecie(specie_code); 

    return this.prisma.specie.update({
      where: { specie_code },
      data: updateSpecieDto,
    });
  }

  async deleteSpecie(specie_code: number): Promise<Specie> {
    await this.validateSpecie(specie_code); 

    console.log(`Deleting all fish entries with specie_code: ${specie_code}`);
    await this.prisma.fish.deleteMany({
      where: { specie_code },
    });

    console.log(`Deleting specie with code: ${specie_code}`);
    return this.prisma.specie.delete({
      where: { specie_code },
    });
  }
}
