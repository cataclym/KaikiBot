import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { ChannelType, EmbedBuilder, Message, TextChannel } from "discord.js";
import fetch from "node-fetch";
import RedditAPIData, { PurpleData } from "../../lib/Interfaces/Common/RedditAPIData";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "reddit",
    description: "Returns a random reddit post, from a specified subreddit.",
    usage: ["anime"],
    typing: true,
})
export default class RedditCommand extends KaikiCommand {

    public async messageRun(message: Message, args: Args): Promise<Message | NodeJS.Timeout> {

        const sub = await args.rest("string");

        const promise = await fetch(`https://www.reddit.com/r/${sub}/random/.json`);

        if (!promise.ok) return message.channel.send({ embeds: [await KaikiEmbeds.noDataReceived(message)] });

        return promise.json()
            .then((json: RedditAPIData | RedditAPIData[]) => Array.isArray(json)
                ? json[0]?.data?.children.map((t) => t.data)
                : json?.data?.children.map((t) => t.data))
            .then((data) => postRandomTitle(data[Math.floor(Math.random() * data.length)]));

        async function postRandomTitle(data: PurpleData) {

            if (!data) {
                return message.channel.send({ embeds: [await KaikiEmbeds.noDataReceived(message)] });
            }

            // We don´t want nsfw in normal channels, do we?
            if (data.over_18 && (!(message.channel as TextChannel)?.nsfw || message.channel.type !== ChannelType.DM)) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder({
                            title: "This post is NSFW",
                            description: "Cannot show NSFW in DMs or non-NSFW channels",
                        })
                            .withErrorColor(message),
                    ],
                })
                    .then(msg => setTimeout(() => {
                        message.delete();
                        msg.delete();
                    }, Constants.MAGIC_NUMBERS.CMDS.FUN.REDDIT.NSFW_DEL_TIMEOUT));
            }

            const embed = new EmbedBuilder({
                author: {
                    name: `Submitted by ${data.author}`,
                    url: data.url,
                },
                footer: { text: `${data.ups} updoots / ${data.upvote_ratio} updoot ratio` },
            })
                .withOkColor(message);

            if (data.title?.length) embed.setTitle(Utility.trim(data.title, Constants.MAGIC_NUMBERS.EMBED_LIMITS.TITLE));
            if (data.selftext?.length) embed.setDescription(Utility.trim(data.selftext, Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION));

            if (!data.is_video && data.url?.length) {
                embed.setImage(data.url);
            }

            else {
                message.channel.send(data.url ?? data.permalink);
            }

            return message.channel.send({ embeds: [embed] });
        }
    }
}
