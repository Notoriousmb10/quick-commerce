"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const productRepository_1 = __importDefault(require("../repositories/productRepository"));
const getAvailableProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield productRepository_1.default.findAvailable();
});
const getProductById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productRepository_1.default.findById(id);
    if (!product)
        throw new Error("Product not found");
    return product;
});
const createProducts = (productsData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield productRepository_1.default.createMany(productsData);
});
const updateProduct = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productRepository_1.default.findById(id);
    if (!product)
        throw new Error("Product not found");
    // Only update fields that are provided
    const fields = ["name", "description", "price", "image", "category", "stock"];
    const finalUpdate = {};
    fields.forEach((field) => {
        if (updateData[field] !== undefined) {
            finalUpdate[field] = updateData[field];
        }
    });
    return yield productRepository_1.default.update(id, finalUpdate);
});
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productRepository_1.default.findById(id);
    if (!product)
        throw new Error("Product not found");
    return yield productRepository_1.default.deleteById(id);
});
exports.default = {
    getAvailableProducts,
    getProductById,
    createProducts,
    updateProduct,
    deleteProduct,
};
