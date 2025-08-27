import { Types } from "mongoose";

export enum DriverStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  SUSPENDED = "SUSPENDED",
  RIDING = "RIDING",
  APPROVED = "APPROVED",
  NOTAPPROVED = "UNDER_REVIEW"
}

export interface VehicleInfo {
  license: string;
  model: string;
  plateNumber: string;
}

export interface IRatings {
  riderId: Types.ObjectId;
  rating: number;
  rideId: Types.ObjectId;
}

export interface IDriver {
  username: string;
  user: Types.ObjectId;
  rider?: Types.ObjectId[];
  rides?: Types.ObjectId[];
  isApproved: boolean;
  vehicleInfo: VehicleInfo;
  driverStatus?: DriverStatus;
  rating?: {
    averageRating?: number;
    totalRatings?: number;
    ratings?: IRatings[];
  };
  totalEarnings?: number;
  totalRides?: number;
}