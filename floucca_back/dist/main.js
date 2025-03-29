"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const type_transform_pipe_1 = require("./pipes/type_transform_pipe");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }), new type_transform_pipe_1.TypeTransformPipe());
    await app.listen(4000);
}
bootstrap();
//# sourceMappingURL=main.js.map