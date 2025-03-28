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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortsController = void 0;
const common_1 = require("@nestjs/common");
const ports_service_1 = require("./ports.service");
const CreatePort_dto_1 = require("./dto/CreatePort.dto");
const id_dto_1 = require("../../shared/dto/id.dto");
let PortsController = class PortsController {
    constructor(portsService) {
        this.portsService = portsService;
    }
    async create(createPortDto) {
        console.log('Received request:', createPortDto);
        return this.portsService.createPort(createPortDto);
    }
    async findAll() {
        return this.portsService.getAllPorts();
    }
    async findOne(params) {
        return this.portsService.getPortById(params.id);
    }
    async update(params, updatePortDto) {
        return this.portsService.updatePort(params.id, updatePortDto);
    }
    async remove(params) {
        return this.portsService.deletePort(params.id);
    }
};
exports.PortsController = PortsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePort_dto_1.CreatePortDto]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, CreatePort_dto_1.CreatePortDto]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", Promise)
], PortsController.prototype, "remove", null);
exports.PortsController = PortsController = __decorate([
    (0, common_1.Controller)('ports'),
    __metadata("design:paramtypes", [ports_service_1.PortsService])
], PortsController);
//# sourceMappingURL=ports.controller.js.map