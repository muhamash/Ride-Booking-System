import { NextFunction, Request, Response } from "express";
import { User } from "../modules/user/user.model";
import { asyncHandler } from "../utils/controller.util";

export const updateUserLocationIntoDb = asyncHandler( async ( req: Request, res: Response, next: NextFunction ) =>
{
    const userLocation = req.userLocation;
    const user = req.user;

    console.log( userLocation, user )
    
    if ( !user || !userLocation )
    {
        return next();
    }

    const locationPayload: Record<string, unknown> = {
        coordinates: [ userLocation.lat, userLocation.lng ],
        address: userLocation.displayName
    }

    const response = await User.findOneAndUpdate(
        { username: user.username },
        { $set: { location: locationPayload } },
        { new: true }
    )

    console.log(response)

    return next()
} );