import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class TypeTransformPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): any {
        if (typeof value !== 'string') {
            return value;
        }

        // Try to transform the value
        const transformedValue = this.parseValue(value);

        if (transformedValue === undefined) {
            throw new BadRequestException(`Invalid parameter: "${value}"`);
        }

        return transformedValue;
    }

    private parseValue(value: string): any {
        // Handle boolean values
        if (value.toLowerCase() === 'true') return true;
        if (value.toLowerCase() === 'false') return false;

        const numberValue = parseFloat(value);
        if (!isNaN(numberValue) && value.trim() === `${numberValue}`) {
            return numberValue;
        }

        if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
            try {
                return JSON.parse(value);
            } catch {
                return undefined;
            }
        }

        const dateValue = new Date(value);
        if (!isNaN(dateValue.getTime())) {
            return dateValue;
        }

        return value;
    }
}
