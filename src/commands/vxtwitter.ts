import { ChatInputCommand, Command } from "@sapphire/framework";

export class VXTwitterCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'vxtwitter',
            description: 'Turn a tweet into a VXTwitter embed',
            requiredClientPermissions: ['MANAGE_MESSAGES']
        });
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction) {
        const url = interaction.options.getString('url') ?? '';

        //Validate that the url is a tweet
        if(!url.startsWith('https://twitter.com/') || !url.includes('/status/')) {
            return interaction.reply({
                content: 'Please provide a valid tweet url',
                ephemeral: true
            });
        }

        //Replace domain with vxtwitter.com
        const vxtwitterUrl = url.replace('twitter.com', 'vxtwitter.com');

        //Post for everyone
        return interaction.reply({
            content: `Here's your VXTwitter embed: \n${vxtwitterUrl}`
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addStringOption((option) =>
                    option
                        .setName('url')
                        .setDescription('The tweet to turn into a VXTwitter embed')
                        .setRequired(true)
                )
        }, {
            idHints: ['1024035545619382393']
        });
    }
}