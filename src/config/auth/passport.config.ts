import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
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
                const user = await User.findOne( { email } );

                if ( !user )
                {
                    return done( null, false, { message: "Invalid email or password" } );
                }

                if ( user.isBlocked )
                {
                    return done( null, false, { message: "Your account is blocked" } );
                }

                if(user.role === UserRole.DRIVER && !user.isApproved)
                {
                    return done( null, false, { message: "Your account is not approved yet" } );
                }

                if ( user.role === UserRole.DRIVER )
                {
                    await User.updateOne(
                        { _id: user._id },
                        { $set: { isOnline: true } }
                    );
                }
                

                const isMatch = await bcrypt.compare( password, user.password );

                if ( !isMatch )
                {
                    return done( null, false, { message: "Invalid email or password" } );
                }

                return done( null, user );
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