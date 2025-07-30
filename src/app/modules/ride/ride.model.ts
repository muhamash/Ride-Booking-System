import { model, Schema } from "mongoose";
import { ratingSchema } from "../driver/driver.model";
import { CancelledBy, IDropOffLocation, IPickUpLocation, IRide, RideStatus } from "./ride.interface";

export const pickUpLocationSchema = new Schema<IPickUpLocation>({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
} );

export const dropOffLocationSchema = new Schema<IDropOffLocation>({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String },
} );

export const rideSchema = new Schema<IRide>( {
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
    pickUpLocation: pickUpLocationSchema,
    dropOffLocation: dropOffLocationSchema,
    fare: { type: Number, required: true },
    status: {
        type: String,
        enum: RideStatus,
        default: RideStatus.REQUESTED,
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    pickedUpAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },
    cancelledBy: {
        type: String,
        enum: CancelledBy,
    },
    distanceInKm: { type: Number },
    durationInMin: { type: Number },
    rating: ratingSchema,
}, {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
} );


export const Ride = model<IRide>( "Ride", rideSchema );