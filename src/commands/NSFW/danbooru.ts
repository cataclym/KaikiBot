import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import { DAPI } from "../../lib/Hentai/HentaiService";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";

@ApplyOptions<KaikiCommandOptions>({
    name: "danbooru",
    description: "Search for random images on Danbooru image board",
    usage: ["thighs wet_skin"],
    typing: true,
    nsfw: true,
})
export default class EAPICommand extends KaikiCommand {
    private videoExtensions = [".mp4", ".webm", ".ts", ".mkv"];

    public async messageRun(message: Message, args: Args): Promise<Message> {
        let content;

        const tags = await args.repeat("string").catch(() => undefined);

        const post = await this.client.hentaiService.makeRequest(
            tags || null,
            DAPI.Danbooru
        );

        const emb = new EmbedBuilder()
            .setAuthor({ name: post.tag_string_artist })
            .setDescription(
                KaikiUtil.trim(`**Tags**: ${post.tag_string_general}`, 2048)
            )
            .setImage(
                post.file_url ||
                    post.preview_file_url ||
                    post.large_file_url ||
                    post.source
            )
            .withOkColor(message);

        if (post.tag_string_character) {
            emb.addFields([
                {
                    name: "Character(s)",
                    value: post.tag_string_character,
                    inline: true,
                },
            ]);
        }

        const isVideo = await (async () => {
            for (const ext of this.videoExtensions) {
                if (post.file_url?.endsWith(ext)) return true;
                return false;
            }
        })();

        if (isVideo) content = post.file_url!;

        return message.channel.send({ content, embeds: [emb] });
    }
}
