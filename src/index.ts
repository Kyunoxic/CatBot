import { SapphireClient } from "@sapphire/framework";
import { clientConfig } from "./config";
import { Logger } from "./util/logger";

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

client.login(clientConfig.api_key);

client.on('ready', () => {
    Logger.log('Ready!')
});