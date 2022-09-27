import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Permissions } from "discord.js";
import { ApplicationCommandType } from 'discord-api-types/v10';

export class UpdateBannerCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'nameprotect',
            description: 'Stops others from changing your nickname',
            requiredUserPermissions: ['CHANGE_NICKNAME'],
            requiredClientPermissions: ['MANAGE_NICKNAMES', 'CHANGE_NICKNAME'],
        });
    }

    public override async chatInputRun(interaction: Command.ChatInputInteraction) {
        if (!interaction.guild || !interaction.member) {
            return interaction.reply({
                content: 'This command can only be used in a server',
                ephemeral: true
            });
        }

        if(interaction.member.user.id !== interaction.user.id) {
            return interaction.reply({
                content: 'You can only use this command on yourself',
                ephemeral: true
            });
        }

        const tHours = interaction.options.getNumber('time', false) ?? 24;
        //calculate timestamp from now + tHours
        const tStamp = Date.now() + (tHours * 60 * 60 * 1000);

        try {
            const member = interaction.guild.members.resolve(interaction.user.id);
            if (!member) throw new Error();

            await interaction.client.db.push(`/nameprotections/${interaction.user.id}`, {
                time: tStamp,
                nickname: member.displayName
            });
        } catch (err) {
            return interaction.reply({
                content: 'Something went wrong.',
                ephemeral: true
            });
        }

        return interaction.reply({
            content: 'Nickname protection has been added',
            ephemeral: true
        });
    }

    public override async contextMenuRun(interaction: Command.ContextMenuInteraction) {
        if (!interaction.isUserContextMenu() || !(interaction.targetMember instanceof GuildMember) || !interaction.guild) {
            return interaction.reply({
                content: 'This command can only be used in a server',
                ephemeral: true
            });
        }

        if(!interaction.targetMember.manageable) {
            return interaction.reply({
                content: 'I cannot change the nickname of this user',
                ephemeral: true
            });
        }
        
        if(interaction.targetMember.id !== interaction.user.id) {
            return interaction.reply({
                content: 'You can only use this command on yourself',
                ephemeral: true
            });
        }

        //calculate timestamp from now + tHours
        const tStamp = Date.now() + (24 * 60 * 60 * 1000);

        try {
            await interaction.client.db.push(`/nameprotections/${interaction.targetMember.id}`, {
                time: tStamp,
                nickname: interaction.targetMember.displayName
            });
        } catch (err) {
            return interaction.reply({
                content: 'Something went wrong.',
                ephemeral: true
            });
        }

        return interaction.reply({
            content: 'Nickname protection has been added for 24 hours.',
            ephemeral: true
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
                .setDefaultMemberPermissions(Permissions.FLAGS.CHANGE_NICKNAME)
                .addNumberOption((option) =>
                    option
                        .setName('time')
                        .setDescription('The amount of time in hours to protect your name for')
                        .setRequired(false)
                        .setMaxValue(24 * 7)
                )
        }, {
            idHints: ['1024331138187153440']
        });
        registry.registerContextMenuCommand((builder) => {
            builder
                .setName('Protect My Name')
                .setDefaultMemberPermissions(Permissions.FLAGS.CHANGE_NICKNAME)
                .setDMPermission(false)
                .setType(ApplicationCommandType.User)
        }, {
            idHints: ['1024331139567071326']
        });
    }
}