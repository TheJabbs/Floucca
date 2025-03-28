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
exports.CreateRegionDto = void 0;
const class_validator_1 = require("class-validator");
class CreateRegionDto {
}
exports.CreateRegionDto = CreateRegionDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: "Region code must be an integer." }),
    (0, class_validator_1.Min)(1, { message: "Region code must be a positive integer." }),
    __metadata("design:type", Number)
], CreateRegionDto.prototype, "region_code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(2, 50, { message: "Region name must be between 2 and 50 characters." }),
    __metadata("design:type", String)
], CreateRegionDto.prototype, "region_name", void 0);
//# sourceMappingURL=create-region.dto.js.map