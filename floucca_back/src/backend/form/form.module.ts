import {Module} from "@nestjs/common";
import {FormService} from "./form.service";
import {FormController} from "./form.controller";
import {FormGateway} from "./form.gateWay";

@Module({
    imports: [],
    controllers: [FormController],
    providers: [FormService, FormGateway],
    exports: [FormGateway]
})
export class FormModule{}