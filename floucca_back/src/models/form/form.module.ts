import {Module} from "@nestjs/common";
import {FormService} from "./form.service";
import {FormController} from "./form.controller";

@Module({
    imports: [],
    controllers: [FormController],
    providers: [FormService],
})
export class FormModule{}