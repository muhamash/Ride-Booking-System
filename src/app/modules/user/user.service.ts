import { User } from "./user.model";

export const createUserService = async (payload: Partial<IUser>) =>
{
    const { email, ...rest } = payload;

    const user = await User.create( { email, ...rest } );

    const createdUser = user.toObject();
    delete createdUser.password;

    // console.log(createdUser, user)
    return createdUser;
}