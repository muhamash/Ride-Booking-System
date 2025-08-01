import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Driver } from "../../app/modules/driver/driver.model";
import { DriverStatus } from "../../app/modules/driver/river.interface";
import { UserRole } from "../../app/modules/user/user.interface";
import { User } from "../../app/modules/user/user.model";

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        async ( req, email, password, done ) =>
        {
            try
            {
                // const userLocation = req.userLocation;
                // const locationPayload:Record<string, unknown> = {
                //     coordinates: [ userLocation.lat, userLocation.lng ],
                //     address: userLocation.displayName
                // }   

                // console.log(locationPayload, "from login passport")
                const user = await User.findOne( { email } );
                let response

                if ( !user )
                {
                    return done( null, false, { message: "Invalid email or password" } );
                }

                if ( user.isBlocked )
                {
                    return done( null, false, { message: "Your account is blocked" } );
                }


                const isMatch = await bcrypt.compare( password, user.password );

                if ( !isMatch )
                {
                    return done( null, false, { message: "Invalid email or password" } );
                }

                response = await User.findOneAndUpdate(
                    { _id: user._id },
                    {
                        $set: {
                            isOnline: true,
                            location: req.userLocation,
                            lastOnlineAt: new Date(),
                        },
                    },
                    { new: true }
                )
                    .populate( "driver" )
                    .select( "-password" );

                if ( response?.role === UserRole.DRIVER )
                {

                    response = await Driver.findOneAndUpdate(
                        { user: user._id },
                        { $set: { driverStatus: DriverStatus.AVAILABLE } },
                        { new: true },
                    ).populate( "user", "email name role location lastOnlineAt" );

                }

                // console.log("User logged in:", response, req.userLocation);
                return done( null, response );
            }
            catch ( error: unknown )
            {
                return done( error )
            }
        }
    )
);

passport.serializeUser( ( user: Express.User, done: ( error: unknown, id?: unknown ) => void ) =>
{
    console.log("serializing the user", user)
    done( null, user._id );
} );

passport.deserializeUser( async ( id: string, done: unknown ) =>
{
    try
    {
        console.log( id );
        const user = await User.findById( id )
        
        done( null, user );
        
    } catch ( error )
    {
        console.log(error)
        done(error)
    }
} );