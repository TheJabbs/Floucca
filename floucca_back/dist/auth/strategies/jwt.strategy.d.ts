import { Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../prisma/prisma.service";
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(payload: {
        user_id: number;
    }): Promise<{
        user_id: number;
        user_fname: string;
        user_lname: string;
        user_email: string;
    }>;
}
export {};
