import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from "express";
import expressSession from "express-session";
import passport from 'passport';
import "../config/auth/passport.config";
import { globalErrorResponse } from './middlewares/globalError.middleware';
import { globalNotFoundResponse } from './middlewares/notFoundRoute.middleware';
import { trackLocationByLatLng } from './middlewares/trackLocation.middleware';
import { homeRoute } from './modules/home/home.controller';
import { adminRouter } from './routes/admin.route';
import { firstVersionRouter } from './routes/module.route';
import { riderRouter } from './routes/ride.route';
import { scheduleUserOfflineJob } from './utils/db/userOfflineJob.util';

const app: Application = express();

app.use( expressSession( {
    secret: "my-secret",
    resave: true,
    saveUninitialized:false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( cookieParser() );
app.use( express.json() );
app.use( cors() );


// user set offline job --> corn
scheduleUserOfflineJob()

// professional route
app.get( "/",trackLocationByLatLng, homeRoute )
app.use( "/api",trackLocationByLatLng, firstVersionRouter )
app.use( "/api",trackLocationByLatLng, adminRouter );
app.use( "/api",trackLocationByLatLng, riderRouter );

// global not found routes
app.use( globalNotFoundResponse )

// global error handler
app.use(globalErrorResponse)


export default app;