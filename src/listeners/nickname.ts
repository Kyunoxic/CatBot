import { Listener } from "@sapphire/framework";
import { GuildMember, PartialGuildMember } from "discord.js";
import { Logger } from "../util/logger";

export class NicknameListener extends Listener {

    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'guildMemberUpdate'
        });
    }

    public async run(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) {
        Logger.log('Event Listener: guildMemberUpdate');

        const client = oldMember.client;
        try {
            const userData = await client.db.getData(`/nameprotections/${newMember.id}`) as { time: number, nickname: string };
            const date = new Date(userData.time);

            //return if date in the past
            if (date < new Date()) {
                await newMember.client.db.delete(`/nameprotections/${newMember.id}`);
                return;
            }

            if (newMember.displayName == userData.nickname) {
                return;
            }

            const changedName = newMember.nickname;
            newMember.setNickname(userData.nickname);

            const dmChannel = await newMember.createDM();
            const message = await dmChannel.send({
                content: `Someone attempted to change your nickname${changedName ? ` to \`${changedName}\`` : ``}.\n`
                    + `Your nickname has been reset to ${userData.nickname}.\n`
                    + 'To remove the block, use the /clearprotect command in the server.'
            });
        } catch (err) {
            return;
        }
    }
}