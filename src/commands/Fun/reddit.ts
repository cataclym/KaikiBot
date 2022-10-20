import { ChannelType, EmbedBuilder, Message, TextChannel } from "discord.js";
import fetch from "node-fetch";
import { PurpleData, RedditData } from "../../lib/Interfaces/IRedditAPI";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class RedditCommand extends KaikiCommand {
    constructor() {
        super("reddit", {
            aliases: ["reddit"],
            typing: true,
            description: "Returns a random reddit post, from a specified subreddit.",
            usage: "anime",
            args: [
                {
                    id: "sub",
                    match: "rest",
                    default: "anime",
                },
            ],
        });
    }

    public async exec(message: Message, { sub }: { sub: string }): Promise<Message | NodeJS.Timeout> {

        const promise = await fetch(`https://www.reddit.com/r/${sub}/random/.json`);

        if (!promise.ok) return message.channel.send({ embeds: [await KaikiEmbeds.noDataReceived(message)] });

        return promise.json()
            .then((json: RedditData | RedditData[]) => Array.isArray(json)
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
                    }, 7500));
            }

            const embed = new EmbedBuilder({
                author: {
                    name: `Submitted by ${data.author}`,
                    url: data.url,
                },
                footer: { text: `${data.ups} updoots / ${data.upvote_ratio} updoot ratio` },
            })
                .withOkColor(message);

            if (data.title?.length) embed.setTitle(Utility.trim(data.title, 256));
            if (data.selftext?.length) embed.setDescription(Utility.trim(data.selftext, 2048));
            !data.is_video && data.url?.length
                ? embed.setImage(data.url)
                : message.channel.send(data.url ?? data.permalink);

            return message.channel.send({ embeds: [embed] });
        }
    }
}
