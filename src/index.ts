import { SapphireClient } from "@sapphire/framework";
import { clientConfig } from "./config";
import { Logger } from "./util/logger";
import schedule from "node-schedule";
import { updateBanner } from "./tasks/banner";

Logger.log('Starting...');

const jobs = [];
const client = new SapphireClient({
    intents: ["GUILDS", "GUILD_MESSAGES"],
    defaultPrefix: clientConfig.prefix,
    caseInsensitiveCommands: true,
    presence: {
        status: "online",
        activities: [{
            name: "VRChat",
            type: "PLAYING"
        }]
    }
});


if(!client) {
    Logger.fatal("Failed to initialize client");
    process.exit(1);
}

client.login(clientConfig.api_key)
    .catch(err => {
        Logger.fatal(err);
        process.exit(1);
    });

client.on('ready', async () => {
    //@ts-expect-error - User will not be null
    Logger.log(`Logged in as ${client.user.tag} (${client.user.id})`);

    //Runs every day at midnight
    jobs.push(schedule.scheduleJob('0 0 0 * * *', async () => {
        Logger.log('Running banner job');
        
        const guild = await client.guilds.fetch(clientConfig.guild_id);
        const channel = await guild.channels.fetch(clientConfig.channel_id);

        if(channel?.type != 'GUILD_TEXT') {
            Logger.warn('Tried to updateBanner with non-textchannel supplied');
        }

        updateBanner(guild, channel);
    }));

    Logger.log('Ready!')
});

client.on('error', err => {
    Logger.error(err.message);
    Logger.error(err.stack);
});

client.on('warn', err => Logger.warn(err));

process.on('unhandledRejection', (reason, promise) => {
    //@ts-expect-error - Unknown object type
    Logger.error(`Unhandled Rejection at: ${promise}\n${reason}\n${reason.stack}`);
});