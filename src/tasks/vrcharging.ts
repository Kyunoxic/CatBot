import { SapphireClient } from "@sapphire/framework";
import { GuildTextBasedChannel } from "discord.js";
import { clientConfig } from "../config";
import { Logger } from "../util/logger";

const peopleToBotherToCharge: string[] = [];

export async function chargeVRStuff(client: SapphireClient): Promise<void> {
    Logger.log('Running chargeVRStuff job');

    const guild = client.guilds.resolve(clientConfig.guild_id);
    const channel = guild?.channels.resolve(clientConfig.vr_channel_id);
    if(!guild || !channel) {
        Logger.error("Failed to find guild or channel");
        return;
    }

    if(channel.type != "GUILD_TEXT") {
        Logger.error("VR channel is not a text channel");
        return;
    }

    const textChannel = channel as GuildTextBasedChannel;
    
    let message = `Hey `;
    peopleToBotherToCharge.forEach(person => message +=`<@${person}>`);
    message += `\n it's time to charge your fucking VR headset!\nYour friend, CoPilot, has sent you a message!`;

    textChannel.send(message);

    return;
}