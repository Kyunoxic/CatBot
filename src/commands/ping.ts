import { ChatInputCommand, Command } from "@sapphire/framework";
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import type { Message } from "discord.js";
import { Time } from "@sapphire/time-utilities";

export class PingCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'ping',
            description: 'Checks bot latency',
           cooldownDelay: Time.Second * 5
        });
    }

    public async messageRun(message: Message) {
        const msg = await message.channel.send('Ping?');
        const content = `Pong from JavaScript! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - message.createdTimestamp}ms.`;
        return msg.edit(content);
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction) {
        const isEphemeral = interaction.options.getBoolean('hidden') ?? true;

        const msg = await interaction.reply({ content: `Ping?`, ephemeral: isEphemeral, fetchReply: true });
        if (isMessageInstance(msg)) {
            const diff = msg.createdTimestamp - interaction.createdTimestamp;
            const ping = Math.round(this.container.client.ws.ping);
            return interaction.editReply(`Pong 🏓! (Round trip took: ${diff}ms. Heartbeat: ${ping}ms.)`);
        }
        return interaction.editReply('Failed to retrieve ping :(');
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addBooleanOption((option) => 
                    option
                        .setName('hidden')
                        .setDescription('Whether the response should be hidden or not')
                        .setRequired(false)
                    )                
        }, {
            idHints: ['1024026311020253235']
        });
    }
}