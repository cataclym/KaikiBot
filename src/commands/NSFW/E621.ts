import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { DAPI } from "../../lib/Hentai/HentaiService";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/Kaiki/KaikiEmbeds";
import Utility from "../../lib/Utility";

@ApplyOptions<KaikiCommandOptions>({
    name: "e621",
    description: "e621 :hahaa:",
    typing: true,
    nsfw: true,
})
export default class EAPICommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message> {

        const tags = await args.pick("string").catch(() => undefined);

        const post = await this.client.hentaiService.apiGrabber(tags ? tags?.split("+").map(tag => tag.replace(" ", "_")) : null, DAPI.E621);
        if (post) {

            const emb = new EmbedBuilder()
                .setAuthor({ name: post.tags.artist.join(", ") || "N/A" })
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
