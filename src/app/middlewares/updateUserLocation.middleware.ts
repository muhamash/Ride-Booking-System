import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { DriverStatus } from "../modules/driver/river.interface";
import { Ride } from "../modules/ride/ride.model";
import { UserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { asyncHandler } from "../utils/controller.util";

export const updateUserLocationIntoDb = asyncHandler( async ( req: Request, res: Response, next: NextFunction ) =>
{
    const userLocation = req.userLocation;
    const user = req.user;

    if ( !user || !userLocation )
    {
        return next();
    }

    const activeDrivers = await User.find(
        { isOnline: true, role: UserRole.DRIVER },
        { location: 1, username: 1, _id: 1, name: 1, email: 1 }
    )
        .select( "-password" )
        .populate( "driver", "driverStatus isApproved vehicleInfo rating _id" )
        .lean();

    // Now filter for AVAILABLE drivers only
    const availableDrivers = activeDrivers.filter(
        ( user ) => user.driver?.driverStatus === DriverStatus.AVAILABLE
    );

    // final payload
    const activeDriverPayload: Record<string, string | number | object>[] = availableDrivers.map( ( user ) => ( {
        driverId: user.driver._id.toString(),
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        location: user.location,
        isApproved: user.driver.isApproved,
        avgRating: user.driver.rating?.averageRating || 0,
        vehicleInfo: user.driver.vehicleInfo || {},
    } ) );

    // console.log( activeDriverPayload );

    req.activeDriverPayload = activeDriverPayload;

    await User.findOneAndUpdate(
        { username: user.username },
        { $set: { location: userLocation } },
        { new: true }
    );

    if ( user.role === UserRole.DRIVER )
    {
        await Ride.findOneAndUpdate(
            { driver: new mongoose.Types.ObjectId( user.userId ) },
            { $set: { driverLocation: userLocation } },
            { new: true }
        );
    }



    return next();
} );