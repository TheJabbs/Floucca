import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class TypeTransformPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
        if (!metadata.metatype) {
            return value;
        }

        if (this.toValidate(metadata.metatype)) {
            const object = plainToInstance(metadata.metatype, { id: value });
            const errors = await validate(object);

            if (errors.length > 0) {
                const errorMessages = errors.map(err => Object.values(err.constraints).join(', ')).join('; ');
                throw new BadRequestException(`Validation failed: ${errorMessages}`);
            }

            return object;
        }

        return this.parseValue(value);
    }

    private toValidate(metatype: any): boolean {
        const types: any[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }


    private parseValue(value: string): any {
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;

        const numberValue = parseFloat(value);
        if (!isNaN(numberValue) && value.trim() === `${numberValue}`) return numberValue;

        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
}
