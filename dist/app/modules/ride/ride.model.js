"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = exports.rideSchema = void 0;
const mongoose_1 = require("mongoose");
const driver_model_1 = require("../driver/driver.model");
const user_model_1 = require("../user/user.model");
const ride_interface_1 = require("./ride.interface");
exports.rideSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver", required: true },
    riderUserName: {
        type: String,
        require: true,
        ref: "User"
    },
    driverUserName: {
        type: String,
        require: true,
        ref: "Driver"
    },
    pickUpLocation: user_model_1.locationSchema,
    dropOffLocation: user_model_1.locationSchema,
    driverLocation: user_model_1.locationSchema,
    fare: { type: Number, required: true },
    status: {
        type: String,
        enum: ride_interface_1.RideStatus,
        default: ride_interface_1.RideStatus.REQUESTED,
    },
    requestedAt: { type: Date, default: Date.now },
    expiresAt: {
        type: Date, default: () => new Date(Date.now() + 5 * 60 * 60 * 1000),
        index: { expireAfterSeconds: 0 },
    },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelledBy: {
        type: String,
        enum: ride_interface_1.CancelledBy,
    },
    distanceInKm: { type: Number },
    durationInMin: { type: Number },
    rating: driver_model_1.ratingSchema,
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
});
exports.Ride = (0, mongoose_1.model)("Ride", exports.rideSchema);
