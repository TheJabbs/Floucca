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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormController = void 0;
const common_1 = require("@nestjs/common");
const form_service_1 = require("./form.service");
const index_1 = require("./DTO/index");
const id_dto_1 = require("../../shared/dto/id.dto");
let FormController = class FormController {
    constructor(formService) {
        this.formService = formService;
    }
    getAllForms() {
        return this.formService.getAllForms();
    }
    getFormById(form_id) {
        return this.formService.getFormById(form_id.id);
    }
    async getTopFormsByUser(id) {
        console.log("Received request for top 20 forms of user ID:", id);
        return this.formService.getTopFormsByUser(id);
    }
    createForm(newForm) {
        return this.formService.createForm(newForm);
    }
    deleteForm(form_id) {
        return this.formService.deleteForm(form_id.id);
    }
    updateForm(form_id, updatedForm) {
        return this.formService.updateForm(form_id.id, updatedForm);
    }
};
exports.FormController = FormController;
__decorate([
    (0, common_1.Get)('/all/forms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FormController.prototype, "getAllForms", null);
__decorate([
    (0, common_1.Get)('/form/:form_id'),
    __param(0, (0, common_1.Param)('form_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], FormController.prototype, "getFormById", null);
__decorate([
    (0, common_1.Get)("/top/:user_id"),
    __param(0, (0, common_1.Param)("user_id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FormController.prototype, "getTopFormsByUser", null);
__decorate([
    (0, common_1.Post)('/create/form'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [index_1.CreateFormDto]),
    __metadata("design:returntype", void 0)
], FormController.prototype, "createForm", null);
__decorate([
    (0, common_1.Delete)('/delete/form/:form_id'),
    __param(0, (0, common_1.Param)('form_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO]),
    __metadata("design:returntype", void 0)
], FormController.prototype, "deleteForm", null);
__decorate([
    (0, common_1.Put)('/update/form/:form_id'),
    __param(0, (0, common_1.Param)('form_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [id_dto_1.idDTO, index_1.UpdateFormDto]),
    __metadata("design:returntype", void 0)
], FormController.prototype, "updateForm", null);
exports.FormController = FormController = __decorate([
    (0, common_1.Controller)('api/dev/form'),
    __metadata("design:paramtypes", [form_service_1.FormService])
], FormController);
//# sourceMappingURL=form.controller.js.map