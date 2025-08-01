import cron from "node-cron";
import { User } from "../../modules/user/user.model";

export const scheduleUserOfflineJob = () =>
{
    cron.schedule( "0 * * * *", async () =>
    {
        const cutoff = new Date( Date.now() - 4 * 60 * 60 * 60 * 1000 );
        await User.updateMany(
            { isOnline: true, lastOnlineAt: { $lt: cutoff } },
            { isOnline: false }
        );

        console.log( "User offline check complete." );
    } );
};