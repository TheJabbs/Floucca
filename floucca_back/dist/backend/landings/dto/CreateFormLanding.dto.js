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
exports.CreateFormLandingDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const DTO_1 = require("../../form/DTO");
const dto_1 = require("../../boat_details/dto");
const createLandings_dto_1 = require("./createLandings.dto");
const create_fish_Dto_1 = require("../../fish/dto/create_fish.Dto");
const effort_today_Dto_1 = require("../../effort_today/dto/effort_today.Dto");
const CreateGearDetail_dto_1 = require("../../gear_detail/dto/CreateGearDetail.dto");
const create_sense_lastw_dto_1 = require("../../sense_lastw/dto/create-sense_lastw.dto");
class CreateFormLandingDto {
}
exports.CreateFormLandingDto = CreateFormLandingDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DTO_1.CreateFormDto),
    __metadata("design:type", DTO_1.CreateFormDto)
], CreateFormLandingDto.prototype, "form", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => dto_1.CreateBoatDetailsDto),
    __metadata("design:type", dto_1.CreateBoatDetailsDto)
], CreateFormLandingDto.prototype, "boat_details", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => createLandings_dto_1.CreateLandingDto),
    __metadata("design:type", createLandings_dto_1.CreateLandingDto)
], CreateFormLandingDto.prototype, "landing", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_fish_Dto_1.CreateFishDto),
    __metadata("design:type", Array)
], CreateFormLandingDto.prototype, "fish", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => effort_today_Dto_1.CreateEffortTodayDto),
    __metadata("design:type", effort_today_Dto_1.CreateEffortTodayDto)
], CreateFormLandingDto.prototype, "effort", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateGearDetail_dto_1.CreateGearDetailDto),
    __metadata("design:type", Array)
], CreateFormLandingDto.prototype, "gearDetail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_sense_lastw_dto_1.CreateSenseLastwDto),
    __metadata("design:type", Array)
], CreateFormLandingDto.prototype, "lastw", void 0);
//# sourceMappingURL=CreateFormLanding.dto.js.map