import z from "zod";
import { DriverStatus } from "../driver/river.interface";
import { UserRole } from "./user.interface";

export const vehicleInfoSchema = z.object( {
    license: z.string( { invalid_type_error: "Name must be string" } ).min( 3, { message: "license must be at least 3 characters long." } ),
    model: z.string( { invalid_type_error: "Name must be string" } ),
    plateNumber: z.string().min( 3, { message: "plate number must be at least 3 characters long." } ),
} );

export const zodUserSchema = z.object( {
    name: z
        .string( { invalid_type_error: "Name must be string" } )
        .min( 2, { message: "Name must be at least 2 characters long." } )
        .max( 50, { message: "Name cannot exceed 50 characters." } ),

    email: z
        .string( { invalid_type_error: "Email must be string" } )
        .email( { message: "Invalid email address format." } )
        .min( 5, { message: "Email must be at least 5 characters long." } )
        .max( 100, { message: "Email cannot exceed 100 characters." } ),

    password: z
        .string( { invalid_type_error: "Password must be string" } )
        .min( 8, { message: "Password must be at least 8 characters long." } )
        .regex( /^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        } ),
    role: z
        .string( { invalid_type_error: "role must be string" } )
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => [ UserRole.ADMIN, UserRole.DRIVER, UserRole.RIDER ].includes( val as UserRole ), {
            message: "Role must be either 'rider', 'driver', or 'admin'.",
        } )
        .default( UserRole.RIDER ).optional(),
    isApproved: z.boolean( { invalid_type_error: "approval decision must be boolean" } ).optional(),
    isOnline: z.boolean( { invalid_type_error: "online decision must be boolean" } ).optional(),
    vehicleInfo: vehicleInfoSchema.optional(),
    driverStatus: z.string( { invalid_type_error: "Driver status must be string" } )
        .transform( ( val ) => val.toUpperCase() )
        .refine( ( val ) => [ DriverStatus.AVAILABLE, DriverStatus.UNAVAILABLE, DriverStatus.SUSPENDED ].includes( val as string ), {
            message: "Driver status must be either 'AVAILABLE', 'UNAVAILABLE', or 'SUSPENDED'.",
        } )
        .default( DriverStatus.AVAILABLE ).optional(),
    isBlocked: z.boolean( { invalid_type_error: "isBlocked must be boolean" } ).default( false ).optional(),
    riderId: z.string( { invalid_type_error: "Rider ID must be a valid ObjectId" } ).optional(),
    username: z.string( { invalid_type_error: "Username must be string" } ).min( 3, { message: "Username must be at least 3 characters long." } ).optional(),
} ).superRefine( ( data, ctx ) =>
{
    if ( data.role === UserRole.DRIVER && !data.vehicleInfo )
    {
        ctx.addIssue( {
            path: [ 'vehicleInfo' ],
            code: z.ZodIssueCode.custom,
            message: 'Vehicle info is required for drivers',
        } );
    }
} );

export const locationZodSchema = z.object( {
    type: z.literal( "Point" ).default( "Point" ),
    coordinates: z
        .tuple( [ z.number(), z.number() ] )
        .default( [ 0, 0 ] ),
    address: z.string().optional(),
} );

export const updateUserZodSchema = z.object( {
    name: z
        .string( { invalid_type_error: "Name must be string" } )
        .min( 2, { message: "Name must be at least 2 characters long." } )
        .max( 50, { message: "Name cannot exceed 50 characters." } ).optional(),
    password: z
        .string( { invalid_type_error: "Password must be string" } )
        .min( 8, { message: "Password must be at least 8 characters long." } )
        .regex( /^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        } )
        .regex( /^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        } )
        .regex( /^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        } ).optional(),
    location: locationZodSchema 

} ).refine(
    ( data ) => Object.keys( data ).some( ( key ) => data[ key as keyof typeof data ] !== undefined ),
    {
        message: "At least one field must be provided for update",
    }
);