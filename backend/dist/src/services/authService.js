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
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const loginLogRepository_1 = __importDefault(require("../repositories/loginLogRepository"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || "secret", {
        expiresIn: "30d",
    });
};
const register = (userData, ip, userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, role } = userData;
    const userExists = yield userRepository_1.default.findByEmail(email);
    if (userExists) {
        throw new Error("User already exists");
    }
    const user = yield userRepository_1.default.create({
        name,
        email,
        password,
        role: role || "customer",
    });
    yield loginLogRepository_1.default.create({
        user: user._id,
        role: user.role,
        ipAddress: ip,
        userAgent: userAgent,
    });
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
    };
});
const login = (email, password, ip, userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_1.default.findByEmailWithPassword(email);
    // Since matchPassword is on the document, we need to ensure user is typed as IUser
    if (user && (yield user.matchPassword(password))) {
        yield loginLogRepository_1.default.create({
            user: user._id,
            role: user.role,
            ipAddress: ip,
            userAgent: userAgent,
        });
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        };
    }
    else {
        throw new Error("Invalid email or password");
    }
});
const getUserProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository_1.default.findById(userId);
    if (!user)
        throw new Error("User not found");
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
    };
});
exports.default = {
    register,
    login,
    getUserProfile,
};
