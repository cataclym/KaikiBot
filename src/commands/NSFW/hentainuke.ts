import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { EmbedBuilder, Message } from "discord.js";
import HentaiService from "../../lib/Hentai/HentaiService";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "hentainuke",
    aliases: ["hn"],
    description: "Posts 30 NSFW images, using the waifu.pics API",
    usage: ["waifu", "neko", "femboy", "blowjob"],
})
export default class HentaiNukeCommand extends KaikiCommand {
    public async exec(message: Message, args: Args): Promise<void> {

        const category = await args.rest("kaikiHentaiTypes").catch(() => null);

        const megaResponse = (await this.client.hentaiService.grabHentai(category ?? HentaiService.hentaiArray[Math.floor(Math.random() * HentaiService.hentaiArray.length)], "bomb"));

        for (let index = 10, p = 0; p < megaResponse.length; index += 10, p += 10) {
            await message.channel.send({
                embeds: megaResponse.slice(p, index).map(link => new EmbedBuilder()
                    .setImage(link)
                    .withOkColor(message)),
            });
        }
    }
}
