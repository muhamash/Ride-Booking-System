/* eslint-disable @typescript-eslint/no-unused-vars */
import app from "./app/app";
import { asyncHandler } from "./app/utils/controller.util";


const startServer = asyncHandler( async () =>
{
    
    const server = app.listen( 3000, () =>
    {
        console.log( `Server is listening at port : 3000 😁` );
        console.log( `Server entry : http://localhost:3000 🛜` )
    } )

} );

startServer();