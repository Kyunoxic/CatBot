import { SapphireClient } from "@sapphire/framework";
import { clientConfig } from "./config";
import { Logger } from "./util/logger";
import schedule from "node-schedule";
import { bannerJob } from "./tasks/banner";
import { vxTwitterHandler } from "./tasks/vxtwitter";
import { discordMediaHandler } from "./tasks/discordmedia";
import { chargeVRStuff } from "./tasks/vrcharging";
import { Config, JsonDB } from "node-json-db";
import * as fs from "fs";

declare module "discord.js" {
    interface Client {
        db: JsonDB;
    }
}

Logger.log('Starting...');

const jobs = [];
const client = new SapphireClient({
    intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS"],
    defaultPrefix: clientConfig.prefix,
    caseInsensitiveCommands: true,
    presence: {
        status: "online",
        activities: [{
            name: "VRChat",
            type: "PLAYING"
        }]
    },
    partials: ["GUILD_MEMBER", "USER"]
});


if(!client) {
    Logger.fatal("Failed to initialize client");
    process.exit(1);
}

//Set up jsonDB
if(!fs.existsSync('./db.json')) {
    fs.writeFileSync('./db.json', '{"nameprotections":{}}');
}
client.db = new JsonDB(new Config("db", true, false, '/'));

client.login(clientConfig.api_key)
    .catch(err => {
        Logger.fatal(err);
        process.exit(1);
    });

client.on('ready', async () => {
    //@ts-expect-error - User will not be null
    Logger.log(`Logged in as ${client.user.tag} (${client.user.id})`);

    //Runs every day at midnight
    jobs.push(schedule.scheduleJob('0 0 0 * * *', async () => bannerJob(client)));
    
    //Runs every day at 18:00
    jobs.push(schedule.scheduleJob('0 0 18 * * *', async () => chargeVRStuff(client)));

    //Ensure no partials for user nicknames
    client.guilds.cache.forEach(async guild => {
        await guild.members.fetch();
    });

    Logger.log('Ready!')    
});

//VXTwitter handling
client.on('messageCreate', async (message) => vxTwitterHandler(message));

//Discordapp Media handling
client.on('messageCreate', async (message) => discordMediaHandler(message));

//Errors and warning logging
client.on('error', err => {
    Logger.error(err.message);
    Logger.error(err.stack);
});

client.on('warn', err => Logger.warn(err));

client.on('chatInputCommandDenied', warn => Logger.warn(warn.message));

process.on('unhandledRejection', (reason, promise) => {
    //@ts-expect-error - Unknown object type
    Logger.error(`Unhandled Rejection at: ${promise}\n${reason}\n${reason.stack}`);
});