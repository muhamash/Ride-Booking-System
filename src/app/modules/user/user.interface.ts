export enum UserRole {
  RIDER = "RIDER",
  ADMIN = "ADMIN",
  DRIVER = "DRIVER"
}

export enum OnlineStatus {
  ACTIVE = 'ACTIVE',
  OFFLINE = 'OFFLINE',
  SUSPENDED = "SUSPENDED"
}

export interface VehicleInfo {
  license: string;
  model: string;
  plateNumber: string;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isBlocked?: boolean;  
            
  isApproved?: boolean;           // driver-specific
  isOnline?: OnlineStatus;        // driver-specific
  vehicleInfo?: VehicleInfo;      // driver-specific
}
