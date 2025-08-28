"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleInfoZodSchema = void 0;
const zod_1 = require("zod");
exports.vehicleInfoZodSchema = zod_1.z.object({
    license: zod_1.z.string().min(1, { message: "License is required" }),
    model: zod_1.z.string().min(1, { message: "Model is required" }),
    plateNumber: zod_1.z.string().min(1, { message: "Plate number is required" }),
}).refine((data) => Object.keys(data).some((key) => data[key] !== undefined), {
    message: "At least one field must be provided for update",
});
