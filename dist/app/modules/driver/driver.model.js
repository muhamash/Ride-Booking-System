"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = exports.driverSchema = exports.ratingSchema = exports.vehicleInfoSchema = void 0;
const mongoose_1 = require("mongoose");
const river_interface_1 = require("./river.interface");
exports.vehicleInfoSchema = new mongoose_1.Schema({
    license: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, unique: true },
});
exports.ratingSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
});
exports.driverSchema = new mongoose_1.Schema({
    isApproved: {
        type: Boolean,
        default: true,
    },
    vehicleInfo: exports.vehicleInfoSchema,
    driverStatus: {
        type: String,
        enum: river_interface_1.DriverStatus,
        default: river_interface_1.DriverStatus.UNAVAILABLE,
    },
    rating: {
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },
        ratings: [exports.ratingSchema],
    },
    totalEarnings: { type: Number, default: 0 },
    totalRides: { type: Number, default: 0 },
    // rider: { type: Schema.Types.ObjectId, ref: "User" },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    username: {
        type: String,
        unique: true,
        ref: "User",
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.Driver = (0, mongoose_1.model)("Driver", exports.driverSchema);
