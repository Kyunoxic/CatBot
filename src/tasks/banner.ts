import { SapphireClient } from "@sapphire/framework";
import { Channel, Collection, Guild, Message, MessageAttachment, MessageEmbed, TextChannel } from "discord.js";
import { clientConfig } from "../config";
import { Logger } from "../util/logger";

export async function bannerJob(client: SapphireClient,) {
    Logger.log('Running banner job');

    const guild = await client.guilds.fetch(clientConfig.guild_id);
    const channel = await guild.channels.fetch(clientConfig.channel_id);

    if (channel?.type != 'GUILD_TEXT') {
        Logger.warn('Tried to updateBanner with non-textchannel supplied');
    }

    updateBanner(guild, channel);
}

export async function updateBanner(guild?: Guild, channel?: Channel | null) {
    if(!guild || !channel) {
        Logger.warn('Guild or channel not found');
        return;
    }

    if(!channel.isText()) {
        Logger.warn('Tried to updateBanner with non-textchannel supplied');
        return;
    }

    const textChannel = channel as TextChannel;
    await textChannel.fetch(); //Ensure up to date
    
    const statusEmbed = createBannerEmbed();
    const statusMessage = await textChannel.send({
        embeds: [statusEmbed]
    });

    let messageSnowflake = '0';
    let messageAt = (await textChannel.messages.fetch({ limit: 1 })).first();
    
    if(!messageAt) {
        Logger.warn(`Could not find message to updateBanner`);
        return -1;
    }

    //Keep looking until all messages for the past 24 hours have been found
    while(messageSnowflake === '0') {
        Logger.log(`Banner: Fetched ${messageAt.id}`);

        const messages: Collection<string, Message> = await textChannel.messages.fetch({
            limit: 20,
            before: messageAt.id
        });

        //In case of only a single message, we can't rely on the before parameter + filtering
        messages.set(messageAt.id, messageAt);
        messages.filter(message => !message.author.bot);

        messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        //Find the first message thats at least 24 hours old
        messages.forEach(message => {
            if(message.createdAt.getTime() < Date.now() - (1000 * 60 * 60 * 24) && messageSnowflake === '0') {
                messageSnowflake = message.id;
            }
        });

        //If we haven't found a message yet, keep looking
        if(messageSnowflake === '0') {
            const lastMessage = messages.last();

            //If we've reached the oldest message, we're done
            if(lastMessage) {
                messageAt = lastMessage;
            } else {
                messageSnowflake = messageAt?.id;
            }
        }
    }

    const messages = await textChannel.messages.fetch({
        limit: 100,
        after: messageSnowflake
    });

    messages.filter(message => !message.author.bot);
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    //@ts-expect-error - If we got here there will be a message.
    statusEmbed.setDescription(`Fetched ${messages.size} messages, starting from <t:${Math.round(messages.last()?.createdAt.getTime() / 1000)}:R>`);
    await statusMessage.edit({
        embeds: [statusEmbed]
    });

    let tries = 0;
    let randomMessage = messages.random();
    const validAttachments: MessageAttachment[] = [];

    while(validAttachments.length < 1 && tries < 100) {
        tries++;

        if(randomMessage && randomMessage.attachments.size > 0) {

            randomMessage.attachments.forEach(attachment => {
                if(attachmentIsImage(attachment) && imageIsProper(attachment)) {
                    validAttachments.push(attachment);
                }
            });
        }
            
        if(validAttachments.length < 1) {
            randomMessage = messages.random();
        }
    }

    if(validAttachments.length < 1) {
        Logger.warn('Could not find any valid attachments');
        
        statusEmbed.addField('No new banners for today!', `Keeping the old one.`)
            .setTimestamp()
            .setColor('#008518');
        await statusMessage.edit({
            embeds: [statusEmbed]
        });

        return 0;
    }

    //Get random attachment from the list, in case a message contains multiple images
    const attachment = validAttachments[Math.floor(Math.random() * validAttachments.length)];

    //Apply banner and update status
    await guild.setBanner(attachment.url)
        .catch(Logger.error);

    statusEmbed.setThumbnail(attachment.url)
        .addField('New Banner Chosen!', `Original by <@${randomMessage?.author.id}>`)
        .setTimestamp()
        .setColor('#008518');
    await statusMessage.edit({
        embeds: [statusEmbed]
    });

    return 0;
}

//Ensure correct file extension
//If attachment has height property, then it is valid viewable content
function attachmentIsImage(attachment: MessageAttachment) {
    return (attachment.height && attachment.height > 0) && (attachment.url.indexOf('.png') > -1 || attachment.url.indexOf('.jpg') > -1);
}

function imageIsProper(attachment: MessageAttachment) {
    //@ts-expect-error - Function is only called after verifying attachment is image
    return (attachment.width / attachment.height > 1.5);
}

function createBannerEmbed() {
    return new MessageEmbed()
        .setColor('#ff8c00')
        .setTitle('Randomly choosing a new banner for today...')
        .setDescription('Checking the previous 24 hours...')
        .setTimestamp();
}