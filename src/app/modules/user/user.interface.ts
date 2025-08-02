import { Schema } from 'mongoose';

export enum UserRole {
  RIDER = "RIDER",
  ADMIN = "ADMIN",
  DRIVER = "DRIVER"
}

export interface ILocation {
  type: 'Point';
  coordinates: [number, number];
  address?: string;
}

export interface VehicleInfo {
  license: string;
  model: string;
  plateNumber: string;
}

export interface IUser {
  name: string;
  email: string;
  username?: string;
  password: string;
  role: UserRole;
  isBlocked: boolean;
  isOnline: boolean;
  driver?: Schema.Types.ObjectId;
  lastOnlineAt?: Date;
  location?: ILocation;
  vehicleInfo?: VehicleInfo;  
  
  isModified(path?: string): boolean;
  isNew?: boolean;
}