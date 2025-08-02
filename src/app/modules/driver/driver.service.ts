import httpStatus from 'http-status-codes';
import mongoose from 'mongoose';
import { AppError } from '../../../config/errors/App.error';
import { RideStatus } from '../ride/ride.interface';
import { Ride } from '../ride/ride.model';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { Driver } from './driver.model';
import { DriverStatus, VehicleInfo } from './river.interface';


export const checkRideRequestService = async (username: string) =>
{
        // console.log(userId)
    if ( !username )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "Wrong username")
    }
    const findRide = await Ride.find({ driverUserName: username, status: RideStatus.REQUESTED });

    if ( findRide.length < 1 )
    {
        throw new AppError(httpStatus.NOT_FOUND, "No Ride exists!!")
    }

    return { rides: findRide, total: findRide.length };
}

export const acceptRideRequestService = async ( rideId: string, user: Partial<IUser> ) =>
{
    if ( !rideId && !user )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "rider id or user not found at the request body")
    }

    const searchRide = await Ride.findOne( {
        _id: rideId,
        status: RideStatus.REQUESTED
    } );
    
    if ( !searchRide )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found or ride is been expired!!")
    }

    if ( searchRide.status === RideStatus.CANCELLED  )
    {
        throw new AppError(httpStatus.NON_AUTHORITATIVE_INFORMATION, "Ride already cancelled!!")
    }

    if ( searchRide.status === RideStatus.ACCEPTED  )
    {
        throw new AppError(httpStatus.NON_AUTHORITATIVE_INFORMATION, `Ride already moved to from requested state!!! :: to :: ${searchRide.status}`)
    }

    const acceptedRide = await Ride.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId( rideId ) },
        { $set: { status: RideStatus.ACCEPTED, acceptedAt: Date.now(), expiresAt: null } },
        { new: true }
    );

    if ( acceptedRide.status === RideStatus.ACCEPTED )
    {
        await Driver.findOneAndUpdate( { username: user.username },
            { $set: { driverStatus: DriverStatus.RIDING } },
            { new: true } );
    }

    console.log(acceptedRide)

    return {
        acceptedRide
    };
}

export const cancelRideRequestService = async ( rideId: string, user: Partial<IUser> ) =>
{
    if ( !rideId )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "ride id  not found at the request body")
    }

    const searchRide = await Ride.findOne( {
        _id: rideId,
        status: RideStatus.REQUESTED
    } );
    
    if ( !searchRide )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found or ride is been expired!!")
    }

    if ( searchRide.status === RideStatus.CANCELLED  )
    {
        throw new AppError(httpStatus.NON_AUTHORITATIVE_INFORMATION, "Ride already cancelled!!")
    }


    const cancelRide = await Ride.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId( rideId ) },
        { $set: { status: RideStatus.CANCELLED, cancelledAt: Date.now(), cancelledBy: user.role , expiresAt: null } },
        { new: true }
    );

    console.log(cancelRide)

    return cancelRide;
}

export const pickUpService = async ( id: string ) =>
{
    if ( !id )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "wrong ride id!!" )
    }

    const searchRide = await Ride.findOne( {
        _id: id,
        status: RideStatus.ACCEPTED
    } );

    if ( !searchRide )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Ride not found or ride is been expired!!" )
    }


    if ( searchRide.status === RideStatus.PICKED_UP )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Ride not found or ride is been picked!!" )
    }

    const pickedUp = await Ride.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId( id ) },
        { $set: { status: RideStatus.PICKED_UP, pickedUpAt: Date.now() } },
        { new: true }
    );

    console.log( pickedUp )
    
    return pickedUp
};

export const inTransitRideService = async (id: string) =>
{
    if ( !id )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "wrong ride id!!")
    }

    const searchRide = await Ride.findOne( {
        _id: id,
        status: RideStatus.PICKED_UP
    } );

    if ( !searchRide )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found or ride is been expired!!")
    }

        if ( searchRide.status === RideStatus.IN_TRANSIT )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found or ride is been in transit!!")
    }

    const inTransit = await Ride.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId( id ) },
        { $set: { status: RideStatus.IN_TRANSIT } },
        { new: true }
    );

    console.log( inTransit )
    
    return inTransit
}

export const completeRideService = async ( id: string, user: Partial<IUser> ) =>
{
    if ( !id )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "wrong ride id!!" )
    }

    const searchRide = await Ride.findOne( {
        _id: id,
        status: RideStatus.IN_TRANSIT
    } );

    if ( !searchRide )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Ride not found or ride is been expired!!" )
    }

        if ( searchRide.status === RideStatus.COMPLETED )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Ride not found or ride is been completed!!")
    }

    const completedRide = await Ride.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId( id ) },
        { $set: { status: RideStatus.COMPLETED, completedAt: Date.now() } },
        { new: true }
    );

    if ( completedRide?.status === RideStatus.COMPLETED )
    {
        const findDriver = await Driver.findOne( { username: user.username } );

        if ( findDriver )
        {
            await Driver.findOneAndUpdate( { username: user.username },
            { $set: { driverStatus: DriverStatus.AVAILABLE, totalRides : findDriver.totalRides + 1, totalEarnings: findDriver.totalEarnings + completedRide.fare } },
            { new: true } );
        }
        else
        {
            throw new AppError(httpStatus.NOT_FOUND, "Driver not. found!!")
        }
    }
    
    return completedRide
};

export const updateVehicleService = async ( userId: string, payload:Partial<VehicleInfo> ) =>
{
    const driver = await Driver.findById( userId );

    if ( !driver )
    {
         throw new AppError( httpStatus.NOT_FOUND, "failed to find the target vehicle!!" )
    }

    const updatedDriver = await Driver.findByIdAndUpdate( driver._id, payload, { new: true, runValidators: true } );

    return updatedDriver
}

export const driverStateService = async ( userId: string ) =>
{
    const user = await User.findById( userId );

    if ( !user )
    {
        throw new AppError(httpStatus.NOT_FOUND, "user not found!!")
    }

    const driver = await Driver.findOne( { user: user._id } );
    if ( driver )
    {
        throw new AppError(httpStatus.CONFLICT, "this user is not a driver!!")
    }

    const rides = await Ride.find( { driver: driver._id } ).populate("driver");

    if ( rides.length < 1 )
    {
        throw new AppError(httpStatus.NOT_FOUND, "no ride  found!!")
    }

    return rides
}