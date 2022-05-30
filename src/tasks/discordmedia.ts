import { Message } from "discord.js";

export async function discordMediaHandler(message: Message) {
    if (message.author.bot) return;

    //Check if message includes a media.discordapp.net URL
    const discordURL = message.content.match(/https:\/\/media\.discordapp\.net\/attachments\/[0-9]+\/[0-9]+\/[a-zA-Z0-9_]+\.[a-zA-Z0-9]+/);
    if (discordURL?.length != 1) return;

    //Check if the filetype is a video format
    const filetype = discordURL[0].split('.').pop();
    if (!filetype || !['mp4', 'webm', 'mkv', 'flv', 'avi', 'mov', 'wmv', 'mpg', 'mpeg', '3gp', 'm4v'].includes(filetype)) return;

    //Destroy it and use Discord CDN!
    const extractedURL = discordURL[0].replace('https://media.discordapp.net/attachments/', 'https://cdn.discordapp.com/attachments/');
    await message.suppressEmbeds(true);
    await message.channel.send(`Original posted by <@${message.author.id}>\n${extractedURL}`);
}