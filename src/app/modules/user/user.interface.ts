export enum UserRole {
  RIDER = "RIDER",
  ADMIN = "ADMIN",
  DRIVER = "DRIVER"
}


export enum DriverStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
  ON_TRIP = "ON_TRIP",
  OFFLINE = "OFFLINE",
  SUSPENDED = "SUSPENDED"
}
export interface VehicleInfo {
  license: string;
  model: string;
  plateNumber: string;
}

export interface IUser
{
  username: string;  
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isBlocked?: boolean;  

  isApproved?: boolean;           // driver-specific
  isOnline?: boolean;        // driver-specific
  vehicleInfo?: VehicleInfo;      // driver-specific
}
