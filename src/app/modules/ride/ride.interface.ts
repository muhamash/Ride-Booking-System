import { Types } from "mongoose";
import { IRatings } from "../driver/river.interface";

export enum RideStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  PICKED_UP = "PICKED_UP",
  IN_TRANSIT = "IN_TRANSIT",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum CancelledBy {
  RIDER = "RIDER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}

export interface IPickUpLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface IDropOffLocation {
  lat: number;
  lng: number;
  address?: string;
}
export interface IRide {
  rider: Types.ObjectId;
  driver?: Types.ObjectId; 
  pickUpLocation: IPickUpLocation;
  dropOffLocation: IDropOffLocation;
  fare: number;
  status: RideStatus;
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelledBy?: CancelledBy;
  distanceInKm?: number;
  durationInMin?: number;
  rating?: IRatings;
};