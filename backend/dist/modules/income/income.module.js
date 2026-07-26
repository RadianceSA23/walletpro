"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const income_schema_1 = require("./schemas/income.schema");
const income_repository_1 = require("./repositories/income.repository");
const income_service_1 = require("./services/income.service");
const income_controller_1 = require("./controllers/income.controller");
const categories_module_1 = require("../categories/categories.module");
let IncomeModule = class IncomeModule {
};
exports.IncomeModule = IncomeModule;
exports.IncomeModule = IncomeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: income_schema_1.Income.name, schema: income_schema_1.IncomeSchema }]),
            categories_module_1.CategoriesModule,
        ],
        controllers: [income_controller_1.IncomeController],
        providers: [income_service_1.IncomeService, income_repository_1.IncomeRepository],
        exports: [income_service_1.IncomeService, income_repository_1.IncomeRepository],
    })
], IncomeModule);
//# sourceMappingURL=income.module.js.map