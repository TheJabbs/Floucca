import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class TypeTransformPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Promise<any>;
    private toValidate;
    private parseValue;
}
