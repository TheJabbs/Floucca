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
exports.UpdateFishDto = void 0;
const class_validator_1 = require("class-validator");
class UpdateFishDto {
}
exports.UpdateFishDto = UpdateFishDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateFishDto.prototype, "specie_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateFishDto.prototype, "landing_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateFishDto.prototype, "gear_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateFishDto.prototype, "fish_weight", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateFishDto.prototype, "fish_length", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateFishDto.prototype, "fish_quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsDecimal)(),
    __metadata("design:type", Number)
], UpdateFishDto.prototype, "price", void 0);
//# sourceMappingURL=update_fish.dto.js.map