import { Args, Command } from "@sapphire/framework";
import type { Message } from "discord.js";
import { updateBanner } from "../tasks/banner";

export class UpdateBannerCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'updatebanner',
            description: 'Updates the server banner with a random image from a channel',
            requiredUserPermissions: ['MANAGE_GUILD'],
            requiredClientPermissions: ['MANAGE_GUILD']
        });
    }

    public async messageRun(message: Message, args: Args) {
        const channel = await args.pick('channel')
        .catch(() => { 
                return message.channel.send('Please provide a channel to pick from');
            });

        if(channel.type != 'GUILD_TEXT' || !message.guild) {
            return message.channel.send('Invalid channel. This command can only be used with a text channel.');
        }

        updateBanner(message.guild, channel);
    }
}