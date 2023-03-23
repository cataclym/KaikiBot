import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import HentaiService from "../../lib/Hentai/HentaiService";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "hentaibomb",
    aliases: ["hb"],
    description: "Posts 5 NSFW images, using the waifu.pics API",
    usage: ["waifu", "neko", "femboy", "blowjob"],
})
export default class HentaiBombCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<Message | Message[]> {

        const category = await args.rest("kaikiHentaiTypes").catch(() => null);

        const megaResponse = (await this.client.hentaiService.grabHentai(category ?? HentaiService.hentaiArray[Math.floor(Math.random() * HentaiService.hentaiArray.length)], "bomb"))
            .splice(0, 5);

        return message.channel.send({ content: megaResponse.join("\n") });
    }
}
