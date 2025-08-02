import { JwtPayload } from "jsonwebtoken";
import { ILocation } from "../../app/modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
        user?: {
            userId: string;
            role: UserRole;
            username?: string;
            email?: string;
            name: string;
        } | JwtPayload;
      userLocation?: ILocation;
      activeDriverPayload?: Record<string, string | number | object>[];
      targetUser?: any;
    }
  }
};

// interface Request {
    //   user?: {
    //     userId: string;
    //   } | JwtPayload;
//       userLocation?: ILocation;
//       activeDriverPayload?: Record<string, string | number | object>[];
//       targetUser?: IUser;
//     }