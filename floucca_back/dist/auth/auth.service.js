"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcryptjs");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        const existingUser = await this.prisma.users.findUnique({
            where: { user_email: registerDto.user_email },
        });
        if (existingUser) {
            throw new common_1.UnauthorizedException("Email already in use");
        }
        const hashedPassword = await bcrypt.hash(registerDto.user_pass, 10);
        const newUser = await this.prisma.users.create({
            data: {
                user_fname: registerDto.user_fname,
                user_lname: registerDto.user_lname,
                user_email: registerDto.user_email,
                user_pass: hashedPassword,
                user_phone: registerDto.user_phone
            },
        });
        return this.generateToken(newUser.user_id);
    }
    async login(loginDto) {
        const user = await this.prisma.users.findUnique({
            where: { user_email: loginDto.user_email },
        });
        if (!user || !(await bcrypt.compare(loginDto.user_pass, user.user_pass))) {
            throw new common_1.UnauthorizedException("Invalid credentials");
        }
        return this.generateToken(user.user_id);
    }
    generateToken(user_id) {
        return {
            access_token: this.jwtService.sign({ user_id }),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map