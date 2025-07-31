import { Types } from "mongoose";

export enum DriverStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  SUSPENDED = "SUSPENDED"
}
export interface VehicleInfo {
  license: string;
  model: string;
  plateNumber: string;
}

export interface IRatings
{
    riderId: Types.ObjectId;
    rating: number;
}

export interface IDriver
{
    username: string;
    rider?: Types.ObjectId[];
    user: Types.ObjectId;

    isApproved: boolean;           
    // isOnline: boolean;           
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