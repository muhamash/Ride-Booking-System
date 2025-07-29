import bcrypt from 'bcryptjs';
import { NextFunction } from "express";
import { model, Schema } from "mongoose";
import { envStrings } from "../../../config/env.config";
import { generateSlug } from '../../utils/helperr.util';
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
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
        enum: Object.values( UserRole ),
        default: UserRole.RIDER
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

// hash password before saving!
userSchema.pre<IUser>( "save", async function ( next: NextFunction )
{
    if ( !this.isModified( 'password' ) ) return next();
    this.password = await bcrypt.hash( this.password, Number( envStrings.BCRYPT_SALT ) );
    
    this.username = generateSlug( this.email, this.role );

    console.log("password hashed!!! username created!!!")

    next();
} );



export const User = model<IUser>( "User", userSchema );