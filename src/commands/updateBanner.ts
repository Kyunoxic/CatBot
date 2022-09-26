import { Args, ChatInputCommand, Command } from "@sapphire/framework";
import { GuildChannel, Message } from "discord.js";
import { updateBanner } from "../tasks/banner";

export class UpdateBannerCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'updatebanner',
            description: 'Updates the server banner with a random image from a channel',
            requiredUserPermissions: ['MANAGE_GUILD'],
            requiredClientPermissions: ['MANAGE_GUILD'],
            runIn: "GUILD_TEXT",
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

        updateBanner(message.guild, channel, false);
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction) {
        if(!interaction.guild) {
            return interaction.reply({
                content: 'This command can only be used in a server',
                ephemeral: true
            });
        }

        const channel = interaction.options.getChannel('channel') as GuildChannel;
        const ephemeral = interaction.options.getBoolean('hidden') ?? false;
        const sneaky = interaction.options.getBoolean('sneaky') ?? false;

        updateBanner(interaction.guild, channel, sneaky);
        
        return interaction.reply({
            content: `Started the banner update task ${sneaky ? 'without notifying the channel' : ''}`,
            ephemeral: ephemeral
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addChannelOption((option) => 
                    option
                        .setName('channel')
                        .setDescription('The channel to pick a random image from')
                        .setRequired(true)
                )
                .addBooleanOption((option) =>
                    option
                        .setName('sneaky')
                        .setDescription('Update banner without notifying users')
                        .setRequired(false)
                )
                .addBooleanOption((option) =>
                    option
                        .setName('hidden')
                        .setDescription('Whether the command should be hidden or not')
                        .setRequired(false)
                )
        }, {
            idHints: ['1024021873673109515']
        });
    }
}