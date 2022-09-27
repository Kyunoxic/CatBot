import { ChatInputCommand, Command } from "@sapphire/framework";
import { GuildMember, Permissions } from "discord.js";
import { ApplicationCommandType } from 'discord-api-types/v10';

export class UpdateBannerCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'clearprotect',
            description: 'Removes nickname protection',
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

        if (interaction.member.user.id !== interaction.user.id) {
            return interaction.reply({
                content: 'You can only use this command on yourself',
                ephemeral: true
            });
        }

        try {
            await interaction.client.db.delete(`/nameprotections/${interaction.user.id}`);
        } catch (err) {
            return interaction.reply({
                content: 'Something went wrong.',
                ephemeral: true
            });
        }

        return interaction.reply({
            content: 'Nickname protection has been removed',
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

        if (!interaction.targetMember.manageable) {
            return interaction.reply({
                content: 'I cannot change the nickname of this user',
                ephemeral: true
            });
        }

        if (interaction.targetMember.id !== interaction.user.id) {
            return interaction.reply({
                content: 'You can only use this command on yourself',
                ephemeral: true
            });
        }

        try {
            await interaction.client.db.delete(`/nameprotections/${interaction.targetMember.id}`);
        } catch (err) {
            return interaction.reply({
                content: 'Something went wrong.',
                ephemeral: true
            });
        }

        return interaction.reply({
            content: 'Nickname protection has been removed',
            ephemeral: true
        });
    }

    public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
        }, {
            idHints: ['1024331136173887528']
        });
        registry.registerContextMenuCommand((builder) => {
            builder
                .setName('Clear Name Protection')
                .setDMPermission(false)
                .setType(ApplicationCommandType.User)
        }, {
            idHints: ['1024331137386029076']
        });
    }
}