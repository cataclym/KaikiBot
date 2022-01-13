import { Message, MessageEmbed } from "discord.js";
import { errorMessage } from "../../lib/Embeds";
import { trim } from "../../lib/Util";
import { DapiGrabber, DapiSearchType } from "./hentaiService";
import { KaikiCommand } from "kaiki";


export default class E621Command extends KaikiCommand {
    constructor() {
        super("e621", {
            aliases: ["e621"],
            description: "e621 :hahaa:",
            typing: true,
            args: [{
                id: "tags",
                match: "rest",
                type: "string",
                default: null,
            }],
        });
    }
    public async exec(message: Message, { tags }: { tags: string | null }): Promise<Message> {
        const post = await DapiGrabber(tags?.split("+").map(tag => tag.replace(" ", "_")) ?? null, DapiSearchType.E621);
        if (post) {

            const emb = new MessageEmbed()
                .setAuthor(post.tags.artist.join(", "))
                .setDescription(trim(`**Tags**: ${post.tags.general.join(",")}`, 2048))
                .setImage(post.file.url || post.preview.url || post.sample.url || post.sources[0])
                .withOkColor(message);

            if (post.tags.character.length) emb.addField("Character(s)", post.tags.character.join(", "), true);

            return message.channel.send({ embeds: [emb] });
        }

        else {
            return message.channel.send({ embeds: [await errorMessage(message, "No data received")] });
        }
    }
}
