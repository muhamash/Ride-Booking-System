import { z } from "zod";

export const zodRideRequest = z.object( {
    lat: z.number().min( -90 ).max( 90 ),
    lng: z.number().min( -180 ).max( 180 ),
    fare: z.any()
} );

export const ratingZodSchema = z.object( {
    rating: z.number().min( 1 ).max( 5 ),
} );