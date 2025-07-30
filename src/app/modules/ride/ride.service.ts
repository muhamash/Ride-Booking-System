import haversineDistance from "haversine-distance";
import { ActiveDriver } from "../../utils/types.util";
import { ILocation, IUser } from "../user/user.interface";

export const requestRideService = async (
    location: ILocation,
    user: Partial<IUser>,
    activeDrivers: ActiveDriver[]
) =>
{
    if ( !location || !activeDrivers?.length )
    {
        throw new Error( "Missing user location or drivers" );
    }

    // Add distance to each driver
    const enrichedDrivers = activeDrivers.map( ( driver ) =>
    {
        const driverCoords = driver.location.coordinates as number[];
        const userCoords = location.coordinates as number[];
        const distance = Number(haversineDistance( userCoords, driverCoords ).toFixed(2));
        return { ...driver, distance };
    } );

    // Sort by highest rating, then by nearest distance
    enrichedDrivers.sort( ( a, b ) =>
    {
        if ( b.avgRating !== a.avgRating )
        {
            return b.avgRating - a.avgRating; 
        }
        return a.distance - b.distance; 
    } );

    const bestMatch = enrichedDrivers[ 0 ];

    // console.log( "Best matched driver:", bestMatch, activeDrivers );

    return {
        user,
        location,
        matchedDriver: bestMatch,
    };
};