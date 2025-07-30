import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
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
                const userLocation = req.userLocation
                console.log(userLocation)
                const user = await User.findOne( { email } );

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

                const response = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $set: { isOnline: true } },
                    { new: true }
                ).populate( "driver" );

                // console.log("User logged in:", response);
                return done( null, response );
            }
            catch ( error: unknown )
            {
                return done(error)
            }
        }
    )
)

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