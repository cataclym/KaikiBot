import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import RedditAPIData from "../../lib/Interfaces/Common/RedditAPIData";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

@ApplyOptions<KaikiCommandOptions>({
    name: "dadjoke",
    aliases: ["dadjokes"],
    description: "Returns a dadjoke.",
    typing: true,
    cooldownDelay: 8000,
})
export default class DadJokeCommand extends KaikiCommand {

    private async loadAndReturnDadJoke() {
        return await fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all")
            .then(res => res.json())
            .then((json: RedditAPIData) => json.data.children.map(t => t.data))
            .then((data) => data[Math.floor(Math.random() * data.length) + 1]);
    }

    public async messageRun(message: Message): Promise<Message | void> {

        const randomRedditPost = await this.loadAndReturnDadJoke();

        if (!randomRedditPost.title || !randomRedditPost.selftext) {
            return;
        }

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Submitted by ${randomRedditPost.author}`,
                        url: randomRedditPost.url,
                    })
                    .setTitle(Utility.trim(randomRedditPost.title, Constants.MAGIC_NUMBERS.EMBED_LIMITS.TITLE))
                    .setDescription(Utility.trim(randomRedditPost.selftext, Constants.MAGIC_NUMBERS.EMBED_LIMITS.DESCRIPTION))
                    .setImage(randomRedditPost.url || "")
                    .setFooter({
                        text: `${randomRedditPost.ups} updoots`,
                    })
                    .withOkColor(message),
            ],
        });
    }
}
