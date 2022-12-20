import { Command } from "discord-akairo";
import { EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import RedditAPIData from "../../lib/Interfaces/RedditAPIData";
import Utility from "../../lib/Utility";
import Constants from "../../struct/Constants";

export default class DadJokeCommand extends Command {
    constructor() {
        super("dadjoke", {
            cooldown: 8000,
            typing: true,
            aliases: ["dadjoke", "dadjokes"],
            description: "Returns a dadjoke.",
        });
    }

    private async loadAndReturnDadJoke() {
        return await fetch("https://www.reddit.com/r/dadjokes.json?limit=1000&?sort=top&t=all")
            .then(res => res.json())
            .then((json: RedditAPIData) => json.data.children.map(t => t.data))
            .then((data) => data[Math.floor(Math.random() * data.length) + 1]);
    }

    public async exec(message: Message): Promise<Message | void> {

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
