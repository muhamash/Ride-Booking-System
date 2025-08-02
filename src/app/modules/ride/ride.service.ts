import haversine from "haversine-distance";
import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { reverseGeocode } from "../../utils/helperr.util";
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

// export const cancelRideService = async ( rideId: string, user: Record<string, string>) =>
// {
//     if ( !rideId )
//     {
//         throw new AppError(httpStatus.BAD_REQUEST, "ride id  not found at the request body")
//     }

//     const searchRide = await Ride.findOne( {
//         _id: rideId,
//         status: RideStatus.REQUESTED
//     } );
    
//     if ( !searchRide )
//     {
//         throw new AppError(httpStatus.NOT_FOUND, "Ride not found or ride is been expired!!")
//     }

//     if ( searchRide.status === RideStatus.CANCELLED  )
//     {
//         throw new AppError(httpStatus.NON_AUTHORITATIVE_INFORMATION, "Ride already cancelled!!")
//     }

//     const cancelRide = await Ride.findOneAndUpdate(
//         { _id: new mongoose.Types.ObjectId( rideId ) },
//         { $set: { status: RideStatus.CANCELLED, cancelledAt: Date.now(), cancelledBy: user.role , expiresAt: null } },
//         { new: true }
//     );

//     console.log(cancelRide)

//     return cancelRide;
// }