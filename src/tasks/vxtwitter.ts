import { Message } from "discord.js";

export async function vxTwitterHandler(message: Message) {
    if (message.author.bot) return;

    await message.fetch();
    let workingURL;

    //Check if message includes a twitter URL
    const twitterURL = message.content.match(/https:\/\/twitter\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+/);
    const xURL = message.content.match(/https:\/\/x\.com\/[a-zA-Z0-9_]+\/status\/[0-9]+/);
    if (twitterURL?.length == 1) {
        workingURL = twitterURL;
    } else if (xURL?.length == 1) {
    	workingURL = xURL;
    } else {
	    return;
    }

    //Check if message has an embed
    //if (message.embeds.length == 0) return;

    //Check if embed contains a video
    //if (!message.embeds[0].video) return;

    //Destroy it and use VXTwitter!
    const extractedURL = workingURL[0].replace('https://twitter.com/', 'https://vxtwitter.com/').replace('https://x.com/', 'https://vxtwitter.com/');
    await message.suppressEmbeds(true);
    await message.channel.send(`Original posted by <@${message.author.id}>\n${extractedURL}`);
}