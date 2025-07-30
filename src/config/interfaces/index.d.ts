import { JwtPayload } from "jsonwebtoken";
import { ILocation } from '../../app/modules/user/user.interface';

declare global
{
    namespace Express
    {
        interface Request
        {
            user: JwtPayload;
            userLocation: ILocation;
            activeDriverPayload: Record<string, string | number | object>[];
        }
    }
}