import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import HentaiService from "../../lib/Hentai/HentaiService";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "hentai",
    description: "Fetches hentai images from Booru boards",
    typing: true,
    nsfw: true,
})
export default class HentaiCommand extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<void | Message> {

        const category = await args.rest("kaikiHentaiTypes").catch(() => null);

        return message.channel.send(await this.client.hentaiService.grabHentai(category || HentaiService.hentaiArray[Math.floor(Math.random() * HentaiService.hentaiArray.length)], "single"));
    }
}
