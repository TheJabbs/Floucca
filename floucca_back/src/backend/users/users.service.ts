import {Injectable, NotFoundException} from "@nestjs/common";
import {PrismaService} from "../../prisma/prisma.service";
import {CreateUserWithDetailsDto} from "./dto/createUserWithDetails.dto";
import {UpdateUserWithDetailsDto} from "./dto/updateUserWithDetails.dto";
import {User} from "./interfaces/users.interface";
import {ResponseMessage} from "src/shared/interface/response.interface";
import * as bcrypt from "bcrypt";
import {BadRequestException} from "@nestjs/common";
import {FormulasService} from "../../formulas/formulas.service";
import {GeneralFilterDto} from "../../shared/dto/general_filter.dto";
import {WorkLoadStatisticInterface} from "./interfaces/workLoadStatistic.interface";


@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    async validateUser(user_id: number): Promise<boolean> {
        const user = await this.prisma.users.findUnique({where: {user_id}});
        return !!user;
    }

    async createUserWithDetails(input: CreateUserWithDetailsDto): Promise<ResponseMessage<{ user_id: number }>> {
        const {user_fname, user_lname, user_email, user_phone, user_pass, coop_codes, role_ids} = input;

        const existingEmail = user_email
            ? await this.prisma.users.findUnique({where: {user_email}})
            : null;
        if (existingEmail) {
            throw new BadRequestException('Email already exists.');
        }

        const existingPhone = user_phone
            ? await this.prisma.users.findUnique({where: {user_phone}})
            : null;
        if (existingPhone) {
            throw new BadRequestException('Phone number already exists.');
        }

        const hashedPassword = await bcrypt.hash(user_pass, 10);

        return this.prisma.$transaction(async (tx) => {
            const newUser = await tx.users.create({
                data: {
                    user_fname,
                    user_lname,
                    user_email,
                    user_phone,
                    user_pass: hashedPassword,
                },
            });

            // Coops table data insert
            await Promise.all(
                coop_codes.map(async (code) => {
                    const coopExists = await tx.coop.findUnique({where: {coop_code: code}});
                    if (!coopExists) {
                        throw new BadRequestException(`Coop code ${code} does not exist.`);
                    }
                    return tx.user_coop.create({
                        data: {
                            user_id: newUser.user_id,
                            coop_code: code,
                        },
                    });
                })
            );

            // Roles table
            await Promise.all(
                role_ids.map(async (roleId) => {
                    const roleExists = await tx.roles.findUnique({where: {role_id: roleId}});
                    if (!roleExists) {
                        throw new BadRequestException(`Role ID ${roleId} does not exist.`);
                    }
                    return tx.user_role.create({
                        data: {
                            user_id: newUser.user_id,
                            role_id: roleId,
                        },
                    });
                })
            );

            return {
                message: `User ${newUser.user_fname} ${newUser.user_lname} created successfully.`,
                data: {user_id: newUser.user_id},
            };
        });
    }

//TO BE SEEN AND IMPLEMENTED LATER WITH TOKEN
// AND Modify generateToken() to use it
    async getUserWithDetails(user_id: number) {
        const user = await this.prisma.users.findUnique({
            where: {user_id},
            select: {
                user_id: true,
                user_fname: true,
                user_lname: true,
                user_email: true,
                user_phone: true,
                user_role: {
                    select: {
                        roles: {
                            select: {
                                role_id: true,
                                role_name: true,
                            }
                        }
                    }
                },
                user_coop: {
                    select: {
                        coop: {
                            select: {
                                coop_code: true,
                                coop_name: true,
                            }
                        }
                    }
                },
            }
        });

        if (!user) throw new NotFoundException('User not found.');
        return user;
    }


    async findAllUsers(): Promise<User[]> {
        return this.prisma.users.findMany({
            include: {
                user_role: {
                    include: {
                        roles: true,
                    },
                },
                user_coop: {
                    include: {
                        coop: true,
                    },
                },
            },
        });
    }


    async findUserById(user_id: number): Promise<User | null> {
        return this.prisma.users.findUnique({
            where: {user_id},
            include: {
                user_role: {
                    include: {
                        roles: true,
                    },
                },
                user_coop: {
                    include: {
                        coop: true,
                    },
                },
            },
        });
    }

    async updateUserWithDetails(
        user_id: number,
        input: UpdateUserWithDetailsDto
    ): Promise<ResponseMessage<{ user_id: number }>> {
        const userExists = await this.prisma.users.findUnique({where: {user_id}});
        if (!userExists) {
            throw new NotFoundException(`User with ID ${user_id} not found.`);
        }

        const {coop_codes, role_ids, ...userData} = input;

        if (userData.user_pass) {
            userData.user_pass = await bcrypt.hash(userData.user_pass, 10);
        }

        return this.prisma.$transaction(async (tx) => {
            await tx.users.update({
                where: {user_id},
                data: userData,
            });

            if (coop_codes?.length) {
                await tx.user_coop.deleteMany({where: {user_id}});

                const coopPromises = coop_codes.map(async (code) => {
                    const coopExists = await tx.coop.findUnique({where: {coop_code: code}});
                    if (!coopExists) throw new BadRequestException(`Coop code ${code} does not exist.`);
                    return tx.user_coop.create({data: {user_id, coop_code: code}});
                });

                await Promise.all(coopPromises);
            }


            if (role_ids?.length) {
                await tx.user_role.deleteMany({where: {user_id}});

                const rolePromises = role_ids.map(async (id) => {
                    const roleExists = await tx.roles.findUnique({where: {role_id: id}});
                    if (!roleExists) throw new BadRequestException(`Role ID ${id} does not exist.`);
                    return tx.user_role.create({data: {user_id, role_id: id}});
                });

                await Promise.all(rolePromises);
            }

            return {
                message: `User with ID ${user_id} updated successfully.`,
                data: {user_id},
            };
        });
    }

    async updateLastLogin(user_id: number): Promise<User> {
        return this.prisma.users.update({
            where: {user_id},
            data: {last_login: new Date()},
        });
    }

    async deleteUser(user_id: number): Promise<User> {
        const userExists = await this.validateUser(user_id);
        if (!userExists) {
            throw new NotFoundException(`User with ID ${user_id} not found.`);
        }

        return this.prisma.users.delete({
            where: {user_id},
        });
    }


async getWorkLoadStat(filter: GeneralFilterDto) {
        const users = await this.prisma.users.findMany({
            where: {
                form: {
                    some: {}
                }
            },
            select: {
                user_id: true,
                user_fname: true,
                user_lname: true,
            }
        });

        const work: WorkLoadStatisticInterface[] = [];
        let allEffortSample = 0, allLaningSample = 0, allSamples = 0;

        const userPromises = users.map(async (user) => {
            const formFilter: any = {
                users: {
                    user_id: user.user_id
                },
                period_date: filter.period,
                port_id: filter.port_id ? { in: filter.port_id } : undefined,
                ports: {
                    coop_code: filter.coop ? { in: filter.coop } : undefined,
                    coop: {
                        region_code: filter.region ? { in: filter.region } : undefined
                    }
                }
            };

            const [landing, effort] = await Promise.all([
                this.prisma.landing.findMany({
                    distinct: ['form_id'],
                    select: {
                        landing_id: true
                    },
                    where: {
                        form: formFilter
                    }
                }),
                this.prisma.sense_lastw.findMany({
                    distinct: ['form_id'],
                    select: {
                        sense_lastW_id: true
                    },
                    where: {
                        form: formFilter
                    }
                })
            ]);

            const total = effort.length + landing.length;
            const totalEffort = effort.length;
            const totalLanding = landing.length;

            allEffortSample += totalEffort;
            allLaningSample += totalLanding;
            allSamples += total;

            return {
                dataOperator: `${user.user_fname} ${user.user_lname}`,
                effortSample: totalEffort,
                landingSamples: totalLanding,
                allSamples: total,
            };
        });

        const results = await Promise.all(userPromises);
        work.push(...results);

        work.forEach((workItem) => {
            workItem.totalEffortPerc = workItem.effortSample / allEffortSample * 100;
            workItem.totalPerc = workItem.allSamples / allSamples * 100;
            workItem.allSamplesPerc = workItem.allSamples / allSamples * 100;
        });

        return {
            work: work,
            totals: {
                allEffortSample: allEffortSample,
                allLaningSample: allLaningSample,
                allSamples: allSamples,
            }
        };
    }}
