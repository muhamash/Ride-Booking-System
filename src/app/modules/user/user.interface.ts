
export enum UserRole
{
    RIDER = "RIDER",
    ADMIN = "ADMIN",
    DRIVER = "DRIVER"
}

export interface VehicleInfo
{
    license: string;
    model: number;
    plateNumber: number;
}

export interface IUser
{
    name: string;
    email: string;
    password: string;
    isBlocked?: boolean;
    role: UserRole;
    vehicleInfo?: VehicleInfo;

}