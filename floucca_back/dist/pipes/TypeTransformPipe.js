"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeTransformPipe = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
let TypeTransformPipe = class TypeTransformPipe {
    async transform(value, metadata) {
        if (metadata.type !== 'param' || !metadata.metatype) {
            return value;
        }
        if (this.toValidate(metadata.metatype)) {
            const object = (0, class_transformer_1.plainToInstance)(metadata.metatype, { id: value });
            const errors = await (0, class_validator_1.validate)(object);
            if (errors.length > 0) {
                const errorMessages = errors
                    .map(err => Object.values(err.constraints).join(', '))
                    .join('; ');
                throw new common_1.BadRequestException(`Validation failed: ${errorMessages}`);
            }
            return object;
        }
        return this.parseValue(value);
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    parseValue(value) {
        if (value.toLowerCase() === 'true')
            return true;
        if (value.toLowerCase() === 'false')
            return false;
        const numberValue = parseFloat(value);
        if (!isNaN(numberValue) && value.trim() === `${numberValue}`)
            return numberValue;
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
};
exports.TypeTransformPipe = TypeTransformPipe;
exports.TypeTransformPipe = TypeTransformPipe = __decorate([
    (0, common_1.Injectable)()
], TypeTransformPipe);
//# sourceMappingURL=TypeTransformPipe.js.map