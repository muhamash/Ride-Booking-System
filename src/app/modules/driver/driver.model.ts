import { Schema } from "mongoose";
import { DriverStatus, IDriver } from "./river.interface";

export const vehicleInfoSchema = new Schema({
    license: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, unique: true },
} );

export const ratingSchema = new Schema({
    riderId: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
});

export const driverSchema = new Schema<IDriver>( {
    isBlocked: { type: Boolean, default: false },
    isOnline: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: true,
    },
    vehicleInfo: vehicleInfoSchema,
    driverStatus: {
        type: String,
        enum: DriverStatus,
        default: DriverStatus.AVAILABLE,
    },
    rating: {
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 },
        ratings: [ ratingSchema ],
    },
    totalEarnings: { type: Number, default: 0 },
    totalRides: { type: Number, default: 0 },
    riderId: { type: Schema.Types.ObjectId, ref: "User" },
    driverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
} );

export const DriverModel = model<IDriver>( "Driver", driverSchema );
