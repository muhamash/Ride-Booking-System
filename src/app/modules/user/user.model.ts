import bcrypt from 'bcryptjs';
import { model, Schema } from "mongoose";
import { envStrings } from "../../../config/env.config";
import { generateSlug } from '../../utils/helperr.util';
import { ILocation, IUser, UserRole } from "./user.interface";

export const locationSchema = new Schema<ILocation>({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    default: [0, 0]
  },
  address: {
    type: String
  }
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
        // select: false
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
    driver: {
        type: Schema.Types.ObjectId,
        ref: "Driver",
        default: null
    },
    location: locationSchema,
},
    {
        timestamps: true,
        versionKey: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// hash password and generate username before saving!
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