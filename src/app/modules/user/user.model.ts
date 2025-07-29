import bcrypt from 'bcryptjs';
import { model, Schema } from "mongoose";
import { envStrings } from "../../../config/env.config";
import { generateSlug } from '../../utils/helperr.util';
import { IUser, UserRole, VehicleInfo } from "./user.interface";

const vehicleInfoSchema = new Schema<VehicleInfo>( {
    license: { type: String, required: true },
    model: { type: String, required: true },
    plateNumber: { type: String, required: true, unique: true },
} );

export const userSchema = new Schema<IUser>( {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        unique: true
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
    isBlocked: { type: Boolean, default: false },
        isOnline: {
        type: Boolean, default: false,
    }, 

    // driver??
    isApproved: {
        type: Boolean, default: false,
        required: function ()
        {
            return this.role === UserRole.DRIVER;
        },
    },
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
userSchema.pre<IUser>( "save", async function ( next )
{
    if ( this.isModified( "password" ) )
    {
        this.password = await bcrypt.hash(
            this.password,
            Number( envStrings.BCRYPT_SALT )
        );
    }

    if ( this.isModified( "email" ) || this.isNew )
    {
        this.username = generateSlug( this.email, this.role );
    }

    next();
} );

// userSchema.virtual( "wasRecentlyOnline" ).get( function ()
// {
//     const cutoff = new Date( Date.now() - 4 * 60 * 60 * 1000 );
//     return this.lastOnlineAt > cutoff;
// } );


export const User = model<IUser>( "User", userSchema );