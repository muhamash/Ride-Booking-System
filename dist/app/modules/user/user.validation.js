"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.locationZodSchema = exports.zodUserSchema = exports.vehicleInfoSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const river_interface_1 = require("../driver/river.interface");
const user_interface_1 = require("./user.interface");
exports.vehicleInfoSchema = zod_1.default.object({
    license: zod_1.default.string()
        .min(3, "License must be at least 3 characters long"),
    model: zod_1.default.string(),
    plateNumber: zod_1.default.string()
        .min(3, "Plate number must be at least 3 characters long")
});
exports.zodUserSchema = zod_1.default.object({
    name: zod_1.default.string()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name cannot exceed 50 characters"),
    email: zod_1.default.string()
        .email("Invalid email address format")
        .min(5, "Email must be at least 5 characters long")
        .max(100, "Email cannot exceed 100 characters"),
    password: zod_1.default.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter"),
    role: zod_1.default.string()
        .transform((val) => val.toUpperCase())
        .refine((val) => Object.values(user_interface_1.UserRole).includes(val), {
        message: "role must be ADMIN | RIDER | DRIVER",
    })
        .transform((val) => val),
    vehicleInfo: exports.vehicleInfoSchema.optional(),
    driverStatus: zod_1.default.nativeEnum(river_interface_1.DriverStatus)
        .default(river_interface_1.DriverStatus.AVAILABLE)
        .optional()
}).superRefine((data, ctx) => {
    if (data.role === user_interface_1.UserRole.DRIVER && !data.vehicleInfo) {
        ctx.addIssue({
            path: ['vehicleInfo'],
            code: zod_1.default.ZodIssueCode.custom,
            message: 'Vehicle info is required for drivers',
        });
    }
    if (data.role !== user_interface_1.UserRole.DRIVER && data.vehicleInfo) {
        delete data.vehicleInfo;
    }
});
exports.locationZodSchema = zod_1.default.object({
    type: zod_1.default.literal("Point").default("Point"),
    coordinates: zod_1.default.tuple([zod_1.default.number(), zod_1.default.number()]).default([0, 0]),
    address: zod_1.default.string().optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default.string()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name cannot exceed 50 characters")
        .optional(),
    newPassword: zod_1.default.string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[A-Z])/, "Password must contain at least 1 uppercase letter")
        .optional(),
    oldPassword: zod_1.default.string().optional(),
}).refine((data) => {
    if (data.newPassword && !data.oldPassword)
        return false;
    return true;
}, {
    message: "old password is required when changing password",
    path: ["oldPassword"],
})
    .refine(data => Object.values(data).some(val => val !== undefined), "At least one field must be provided for update");
