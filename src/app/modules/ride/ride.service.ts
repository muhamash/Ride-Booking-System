import haversine from "haversine-distance";
import httpStatus from 'http-status-codes';
import mongoose from "mongoose";
import { AppError } from "../../../config/errors/App.error";
import { reverseGeocode } from "../../utils/helperr.util";
import { Driver } from "../driver/driver.model";
import { ILocation } from "../user/user.interface";
import { RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

export const requestRideService = async (
    pickUpLocation: ILocation,
    user: any,
    activeDrivers: any,
    dropLat: number,
    dropLng: number
) =>
{
    if ( !activeDrivers?.length )
    {
        throw new AppError(httpStatus.EXPECTATION_FAILED, "No drivers are online!!" );
    }

    if ( !pickUpLocation ||  !dropLat || !dropLng )
    {
        throw new AppError(httpStatus.EXPECTATION_FAILED, "Missing data: user location, or destination" );
    }

    const riderId : any = user.userId
    const isExistRequest = await Ride.find( {
        rider: riderId,
        status: { $eq: RideStatus.REQUESTED }
    } );

    // console.log(isExistRequest)
    if ( isExistRequest.length > 0 )
    {
        throw new AppError(httpStatus.CONFLICT, "You have pending rides on database!!" );
    }

    // Get address of the destination
    const dropOffLocationAddress = await reverseGeocode( dropLat, dropLng );
    const dropOffLocation: ILocation = {
        type: "Point",
        coordinates: [ dropLat, dropLng ],
        address: dropOffLocationAddress?.displayName || "Unknown",
    };

    // Add distance to each driver
    const enrichedDrivers = activeDrivers.map( ( driver ) =>
    {
        const driverCoords = driver.location.coordinates;
        const riderCoords = pickUpLocation.coordinates;
        const distanceInMeters = haversine( riderCoords, driverCoords );
        const distanceInKm = Number( ( distanceInMeters / 1000 ).toFixed( 2 ) );

        return {
            ...driver,
            distanceInKm,
        };
    } );

    // Sort: highest rating first, then closest
    enrichedDrivers?.sort( ( a, b ) =>
    {
        if ( b.avgRating !== a.avgRating ) return b.avgRating - a.avgRating;
        return a.distanceInKm - b.distanceInKm;
    } );

    // console.log( enrichedDrivers );
    const matchedDriver = enrichedDrivers[ 0 ];
    if ( !matchedDriver ) throw new Error( "No available driver found" );

    // Estimate fare (simplified example: 50 BDT base + 25/km)
    const estimatedFare = 50 + 25 * matchedDriver.distanceInKm;

    const newRide = await Ride.create( {
        rider: riderId,
        driver: matchedDriver?.driverId,
        pickUpLocation,
        dropOffLocation,
        driverLocation: matchedDriver?.location,
        distanceInKm: matchedDriver?.distanceInKm,
        fare: estimatedFare,
        status: RideStatus.REQUESTED,
        requestedAt: new Date(),
        riderUserName: user.username,
        driverUserName: matchedDriver?.username,
        
    } );

    const ride = await Ride.findById( newRide._id )
        .populate( "rider", "name email username" )
        .populate( "driver", "vehicleInfo rating driverStatus username user" );

    return { ride, totalAvailable:enrichedDrivers.length}
 
};

export const ratingRideService = async (
    user: any,
    rideId: string,
    body: { rating: number }
) =>
{
    const { rating } = body;

    if ( !rating || rating < 1 || rating > 5 )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Rating must be between 1 and 5." );
    }

    const ride = await Ride.findById( rideId );
    if ( !ride )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Ride not found." );
    }

    console.log(ride, user)

    if ( !ride.rider || !user.userId || ride.rider.toString() !== user.userId )
    {
        throw new AppError( httpStatus.FORBIDDEN, "You are not authorized to rate this ride." );
    }


    if ( ride.status !== RideStatus.COMPLETED )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "You can only rate a completed ride." );
    }

    if ( ride.rating && ride.rating.rating )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "This ride has already been rated." );
    }

    //  Save rating to ride
    ride.rating = {
        riderId: new mongoose.Types.ObjectId(user.userId),
        rating,
        rideId: ride._id,
    };
    await ride.save();

    let updatedDriver = null;

    if ( ride.driver )
    {
        const driver = await Driver.findById( ride.driver );
        if ( driver )
        {
            const oldTotal = driver.rating?.totalRatings || 0;
            const oldAverage = driver.rating?.averageRating || 0;
            const newTotal = oldTotal + 1;
            const newAverage = ( oldAverage * oldTotal + rating ) / newTotal;

            updatedDriver = await Driver.findByIdAndUpdate(
                driver._id,
                {
                    $set: {
                        "rating.averageRating": newAverage,
                        "rating.totalRatings": newTotal,
                    },
                    $push: {
                        "rating.ratings": {
                            riderId: new mongoose.Types.ObjectId(user.userId),
                            rating,
                            rideId: ride._id,
                        },
                    },
                },
                { new: true }
            );
        }
    }

    return {
        rideRating: ride.rating,
        driverRating: updatedDriver?.rating ?? null,
    };
};