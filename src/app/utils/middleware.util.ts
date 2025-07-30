import httpStatus from 'http-status-codes';
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { AppError } from '../../config/errors/App.error';
import { ILocation } from '../modules/user/user.interface';

export const isZodError = ( error: unknown ): error is { issues: unknown[] } =>
{
    return error && typeof error === "object" && "issues" in error && Array.isArray( error.issues );
};

export function parseZodError(error: unknown): unknown[] {
  if (!(error instanceof ZodError)) return [];

  const formatted = error.format();
  const issues: unknown[] = [];

  for (const key in formatted) {
    if (key === "_errors") continue;

    const fieldErrors = formatted[key]?._errors;
    if (fieldErrors && fieldErrors.length > 0) {
      fieldErrors.forEach((msg : string) => {
        issues.push({
          field: key,
          message: msg,
        });
      });
    }
  }

  return issues;
};

export const generateToken = ( payload: unknown, secret: string, options?: jwt.SignOptions ) : string =>
{
  return jwt.sign( payload as unknown, secret, options );
};

export const verifyToken = ( token: string, secret: string ) =>
{

  const verifiedToken = jwt.verify( token, secret );

  if ( verifiedToken )
  {
    return verifiedToken
  }
  else
  {
    throw new AppError( httpStatus.BAD_REQUEST, `Error in verify token` )
  }
};


export const generateRandomDhakaLocations = (count = 300): ILocation[] => {
  const centerLat = 23.8103; 
  const centerLng = 90.4125;
  const maxOffset = 0.05;

  const locations: Location[] = [];

  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * maxOffset * 2;
    const lngOffset = (Math.random() - 0.5) * maxOffset * 2;

    const lat = parseFloat((centerLat + latOffset).toFixed(6));
    const lng = parseFloat((centerLng + lngOffset).toFixed(6));

    locations.push( {
      lat,
      lng,
    } );
  }

  return locations;
};