"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingZodSchema = exports.zodRideRequest = void 0;
const zod_1 = require("zod");
exports.zodRideRequest = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
});
exports.ratingZodSchema = zod_1.z.object({
    riderId: zod_1.z.string().regex(/^[a-f\d]{24}$/i, {
        message: "Invalid ObjectId format",
    }),
    rating: zod_1.z.number().min(1).max(5),
});
