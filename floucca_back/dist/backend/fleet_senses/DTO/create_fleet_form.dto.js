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
exports.CreateFleetFormDto = void 0;
const dto_1 = require("../../form/dto");
const dto_2 = require("../../boat_details/dto");
const form_gear_usage_dto_1 = require("../../gear_usage/dto/form_gear_usage.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateFleetFormDto {
}
exports.CreateFleetFormDto = CreateFleetFormDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => dto_1.CreateFormDto),
    __metadata("design:type", dto_1.CreateFormDto)
], CreateFleetFormDto.prototype, "formDto", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => dto_2.CreateBoatDetailsDto),
    __metadata("design:type", dto_2.CreateBoatDetailsDto)
], CreateFleetFormDto.prototype, "boatDetailDto", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => form_gear_usage_dto_1.FormGearUsageDto),
    __metadata("design:type", Array)
], CreateFleetFormDto.prototype, "gearUsageDto", void 0);
//# sourceMappingURL=create_fleet_form.dto.js.map