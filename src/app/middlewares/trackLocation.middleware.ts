import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/controller.util";
import { reverseGeocode } from "../utils/helperr.util";
import { generateRandomDhakaLocations } from "../utils/middleware.util";

export const trackLocationByLatLng = asyncHandler( async ( req: Request, res: Response, next: NextFunction ) =>
{
    const { lat, lng } = await generateRandomDhakaLocations();

    // console.log(lat, lng)

    if ( !lat || !lng ) return next();

    const latNum = parseFloat( lat as string );
    const lngNum = parseFloat( lng as string );

    if ( isNaN( latNum ) || isNaN( lngNum ) ) return next();

    const geo = await reverseGeocode( latNum, lngNum );

    // console.log( geo, lat, lng ,"tracker middleware");
    
    if ( geo )
    {
        const locationPayload: Record<string, unknown> = {
            coordinates: [ geo.lat, geo.lng ],
            address: geo.displayName
        }
        req.userLocation = locationPayload;
        req.headers[ "x-user-location" ] = JSON.stringify( geo );
    }

    next();
} );