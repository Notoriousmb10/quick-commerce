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
const Order_1 = __importDefault(require("../models/Order"));
const create = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const order = new Order_1.default(orderData);
    return yield order.save();
});
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.findById(id);
});
const findByIdPopulated = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.findById(id)
        .populate("customer", "name email")
        .populate("deliveryPartner", "name email")
        .populate("items.product", "name image price");
});
const findByCustomer = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.find({ customer: customerId })
        .populate("items.product", "name price image")
        .sort({ createdAt: -1 });
});
const findAllAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.find({})
        .populate("customer", "name")
        .populate("deliveryPartner", "name")
        .sort({ createdAt: -1 });
});
const findAvailableForPartners = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.find({ status: "placed" })
        .populate("customer", "name")
        .populate("items.product", "name")
        .sort({ createdAt: 1 });
});
const findByPartner = (partnerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.find({ deliveryPartner: partnerId })
        .populate("customer", "name")
        .populate("items.product", "name")
        .sort({ createdAt: -1 });
});
const update = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.findByIdAndUpdate(id, updateData, { new: true });
});
const updateWithPopulation = (id_1, updateData_1, ...args_1) => __awaiter(void 0, [id_1, updateData_1, ...args_1], void 0, function* (id, updateData, populateFields = []) {
    let query = Order_1.default.findByIdAndUpdate(id, updateData, { new: true });
    populateFields.forEach((field) => {
        query = query.populate(field.path, field.select);
    });
    return yield query;
});
const deleteById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Order_1.default.findByIdAndDelete(id);
});
exports.default = {
    create,
    findById,
    findByIdPopulated,
    findByCustomer,
    findAllAdmin,
    findAvailableForPartners,
    findByPartner,
    update,
    updateWithPopulation,
    deleteById,
};
