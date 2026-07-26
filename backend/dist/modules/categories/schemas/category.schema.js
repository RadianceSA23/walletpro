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
exports.CategorySchema = exports.Category = exports.CategoryType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var CategoryType;
(function (CategoryType) {
    CategoryType["INCOME"] = "INCOME";
    CategoryType["EXPENSE"] = "EXPENSE";
})(CategoryType || (exports.CategoryType = CategoryType = {}));
let Category = class Category {
};
exports.Category = Category;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', default: null, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Category.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: CategoryType, index: true }),
    __metadata("design:type", String)
], Category.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: '#6366F1' }),
    __metadata("design:type", String)
], Category.prototype, "color", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 'tag' }),
    __metadata("design:type", String)
], Category.prototype, "icon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Category.prototype, "isSystem", void 0);
exports.Category = Category = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'categories' })
], Category);
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
exports.CategorySchema.index({ userId: 1, type: 1 });
exports.CategorySchema.index({ isSystem: 1, type: 1 });
exports.CategorySchema.index({ name: 'text' });
//# sourceMappingURL=category.schema.js.map