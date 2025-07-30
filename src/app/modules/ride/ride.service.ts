import haversine from "haversine-distance";
import httpStatus from 'http-status-codes';
import { AppError } from "../../../config/errors/App.error";
import { reverseGeocode } from "../../utils/helperr.util";
import { ActiveDriver } from "../../utils/types.util";
import { ILocation, IUser } from "../user/user.interface";
import { RideStatus } from "./ride.interface";
import { Ride } from "./ride.model";

export const requestRideService = async (
    pickUpLocation: ILocation,
    user: Partial<IUser>,
    activeDrivers: ActiveDriver[],
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
        const driverCoords = driver.location.coordinates as number[];
        const riderCoords = pickUpLocation.coordinates as number[];
        const distanceInMeters = haversine( riderCoords, driverCoords );
        const distanceInKm = Number( ( distanceInMeters / 1000 ).toFixed( 2 ) );
        return { ...driver, distanceInKm };
    } );

    // Sort: highest rating first, then closest
    enrichedDrivers.sort( ( a, b ) =>
    {
        if ( b.avgRating !== a.avgRating ) return b.avgRating - a.avgRating;
        return a.distanceInKm - b.distanceInKm;
    } );

    const matchedDriver = enrichedDrivers[ 0 ];
    if ( !matchedDriver ) throw new Error( "No available driver found" );

    // Estimate fare (simplified example: 50 BDT base + 25/km)
    const estimatedFare = 50 + 25 * matchedDriver.distanceInKm;

    const newRide = await Ride.create( {
        rider: user.userId,
        driver: matchedDriver.driverId,
        pickUpLocation,
        dropOffLocation,
        driverLocation: matchedDriver.location,
        distanceInKm: matchedDriver.distanceInKm,
        fare: estimatedFare,
        status: RideStatus.REQUESTED,
        requestedAt: new Date(),
    } );

    const ride = await Ride.findById( newRide._id )
        .populate( "rider", "name email username" )
        .populate( "driver", "vehicleInfo rating driverStatus" );

    return ride;

};