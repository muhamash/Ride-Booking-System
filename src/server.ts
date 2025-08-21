import http from "http";
import { Socket, Server as SocketIOServer } from "socket.io";
import app from "./app/app";
import { ILocation } from "./app/modules/user/user.interface";
import { User } from "./app/modules/user/user.model";
import { dbConnect } from "./config/db/mongoos.config";

interface IUserLocation {
  userId: string;
  coordinates: [number, number];
  address?: string;
}

const startServer = async () =>
{
    try
    {
        await dbConnect();

        // Wrap Express app in HTTP server
        const server = http.createServer( app );

        // Attach Socket.IO
        const io = new SocketIOServer( server, {
            cors: { origin: "*" },
        } );

        io.on( "connection", ( socket: Socket ) =>
        {
            console.log( "Client connected:", socket.id );

            // Listen for location updates
            socket.on( "update-location", async ( data: IUserLocation ) =>
            {
                console.log( "Received location:", data );

                try
                {
                    const locationPayload: ILocation = {
                        type: 'Point',
                        coordinates: [ data.coordinates[ 0 ], data.coordinates[ 1 ] ],
                        address: data.address
                    };

                    // Save/update in DB
                    const user = await User.findOneAndUpdate(
                        { _id: data.userId },
                        { $set: { location: locationPayload } },
                        { upsert: true, new: true }
                    );

                    // console.log(locationPayload)
                }
                catch ( err )
                {
                    console.error( "Failed to save location:", err );
                }

                // Broadcast to other clients
                socket.broadcast.emit( "user-location-updated", data );
            } );

            socket.on( "disconnect", () =>
            {
                console.log( "Client disconnected:", socket.id );
            } );
        } );

        const PORT = 3000;
        server.listen( PORT, () =>
        {
            console.log( `Server is listening at http://localhost:${ PORT } 😁` );
        } );
    } catch ( error )
    {
        console.error( error );
    }
};

startServer();