import { EmbedBuilder, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";
import { DapiGrabber, DapiSearchType } from "./hentaiService";

export default class E621Command extends KaikiCommand {
    constructor() {
        super("e621", {
            aliases: ["e621"],
            description: "e621 :hahaa:",
            typing: true,
            args: [
                {
                    id: "tags",
                    match: "rest",
                    type: "string",
                    default: null,
                },
            ],
        });
    }

    public async exec(message: Message, { tags }: { tags: string | null }): Promise<Message> {
        const post = await DapiGrabber(tags?.split("+").map(tag => tag.replace(" ", "_")) ?? null, DapiSearchType.E621);
        if (post) {

            const emb = new EmbedBuilder()
                .setAuthor({ name: post.tags.artist.join(", ") })
                .setDescription(Utility.trim(`**Tags**: ${post.tags.general.join(",")}`, 2048))
                .setImage(post.file.url || post.preview.url || post.sample.url || post.sources[0])
                .withOkColor(message);

            if (post.tags.character.length) {
                emb.addFields([
                    {
                        name: "Character(s)",
                        value: post.tags.character.join(", "),
                        inline: true,
                    },
                ]);
            }

            return message.channel.send({ embeds: [emb] });
        }

        else {
            return message.channel.send({ embeds: [await KaikiEmbeds.errorMessage(message, "No data received")] });
        }
    }
}
