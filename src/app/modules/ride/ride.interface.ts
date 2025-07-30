import { Types } from "mongoose";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId; 
  pickupLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  dropLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  fare: number;
  status: RideStatus;
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: "RIDER" | "DRIVER" | "ADMIN";
  paymentMethod?: string;
  paymentStatus?: "PENDING" | "PAID" | "FAILED";
  distanceInKm?: number;
  durationInMin?: number;
  rating?: {
    riderRating?: number;
    driverRating?: number;
    feedback?: string;
  };
};