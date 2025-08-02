import { JwtPayload } from "jsonwebtoken";
import { ILocation } from "../../app/modules/user/user.interface";

declare global {
  namespace Express {
    interface User {
      userId?: string;
      role?: UserRole;
      username?: string;
      email?: string;
      name?: string;
    }

    interface Request {
      user?: User | JwtPayload;
      userLocation?: ILocation;
      activeDriverPayload?: Record<string, string | number | object>[];
      targetUser?: any;
    }
  }
};