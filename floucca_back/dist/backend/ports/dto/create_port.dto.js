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
exports.CreatePortDto = void 0;
const class_validator_1 = require("class-validator");
class CreatePortDto {
}
exports.CreatePortDto = CreatePortDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: "Port name must not exceed 50 characters." }),
    __metadata("design:type", String)
], CreatePortDto.prototype, "port_name", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: "Coop code must be an integer." }),
    (0, class_validator_1.Min)(1, { message: "Coop code must be a positive integer." }),
    __metadata("design:type", Number)
], CreatePortDto.prototype, "coop_code", void 0);
//# sourceMappingURL=create_port.dto.js.map