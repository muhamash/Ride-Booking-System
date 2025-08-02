"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogin = void 0;
const zod_1 = __importDefault(require("zod"));
exports.authLogin = zod_1.default.object({
    email: zod_1.default.string()
        .email("Invalid email address")
        .min(5, "Email must be at least 5 characters")
        .max(100, "Email cannot exceed 100 characters"),
    password: zod_1.default.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter")
});
