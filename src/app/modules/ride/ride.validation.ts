import { z } from "zod";

export const zodRideRequest = z.object( {
    lat: z.number().min( -90 ).max( 90 ),
    lng: z.number().min( -180 ).max( 180 ),
} );

export const ratingZodSchema = z.object( {
    riderId: z.string().regex( /^[a-f\d]{24}$/i, {
        message: "Invalid ObjectId format",
    } ),
    rating: z.number().min( 1 ).max( 5 ),
} );