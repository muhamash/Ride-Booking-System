"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingZodSchema = exports.zodRideRequest = void 0;
const zod_1 = require("zod");
exports.zodRideRequest = zod_1.z.object({
    lat: zod_1.z.number().min(-90).max(90),
    lng: zod_1.z.number().min(-180).max(180),
    fare: zod_1.z.any(),
    picLat: zod_1.z.number().min(-90).max(90).optional(),
    picLng: zod_1.z.number().min(-180).max(180).optional(),
});
exports.ratingZodSchema = zod_1.z.object({
    rating: zod_1.z.number().min(1).max(5),
});
