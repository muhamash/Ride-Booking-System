import bcrypt from 'bcrypt';
import { NextFunction } from "express";
import { model, Schema } from "mongoose";
import { envStrings } from "../../../config/env.config";
import { IUser, UserRole, VehicleInfo } from "./user.interface";


const vehicleInfoSchema = new Schema<VehicleInfo>( {
    license: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, required: true },
} );

export const userSchema = new Schema<IUser>( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [ 5, 'Password must be at least 5 characters long' ],
        // validate: {
        //     validator: function ( value: string )
        //     {
        //         return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test( value );
        //     },
        //     message:
        //         'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
        // },
    },
    role: {
        type: String,
        required: true,
        enum: Object.values( UserRole )
    },

    // driver??
    isApproved: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    vehicleInfo: {
        type: vehicleInfoSchema,
        required: function ()
        {
            return this.role === UserRole.DRIVER;
        },
    }
},
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);


userSchema.pre<IUser>( "save", async function ( next: NextFunction )
{
    if ( !this.isModified( 'password' ) ) return next();
    this.password = await bcrypt.hash( this.password, Number( envStrings.BCRYPT_SALT ) );
    
    console.log("password hashed!!!")

    next();
} );

export const User = model<IUser>( "User", userSchema );