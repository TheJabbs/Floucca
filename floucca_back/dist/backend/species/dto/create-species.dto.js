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
exports.CreateSpecieDto = void 0;
const class_validator_1 = require("class-validator");
class CreateSpecieDto {
}
exports.CreateSpecieDto = CreateSpecieDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: "specie_code must be a positive integer." }),
    __metadata("design:type", Number)
], CreateSpecieDto.prototype, "specie_code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50, { message: "specie_name must not exceed 50 characters." }),
    __metadata("design:type", String)
], CreateSpecieDto.prototype, "specie_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500, { message: "specie_description must not exceed 500 characters." }),
    __metadata("design:type", String)
], CreateSpecieDto.prototype, "specie_description", void 0);
__decorate([
    (0, class_validator_1.IsPositive)({ message: "specie_avg_weight must be a positive number." }),
    __metadata("design:type", Number)
], CreateSpecieDto.prototype, "specie_avg_weight", void 0);
__decorate([
    (0, class_validator_1.IsPositive)({ message: "specie_avg_length must be a positive number." }),
    __metadata("design:type", Number)
], CreateSpecieDto.prototype, "specie_avg_length", void 0);
//# sourceMappingURL=create-species.dto.js.map