export enum UserRole {
  RIDER = "RIDER",
  ADMIN = "ADMIN",
  DRIVER = "DRIVER"
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
  isOnline?: boolean;        
}