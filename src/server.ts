/* eslint-disable @typescript-eslint/no-unused-vars */
import app from "./app/app";
import { dbConnect } from "./config/db/mongoos.config";


const startServer = async () =>
{
    try
    {
        await dbConnect();
        
        const server = app.listen( 3000, () =>
        {
            console.log( `Server is listening at port : 3000 😁` );
            console.log( `Server entry : http://localhost:3000 🛜` )
        } )
    }
    catch ( error: unknown )
    {
        console.log(error)
    }
};

startServer();