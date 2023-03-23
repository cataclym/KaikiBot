import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import fetch from "node-fetch";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/Kaiki/KaikiUtil";

@ApplyOptions<KaikiCommandOptions>({
    name: "woof",
    description: "Woof.",
})
export default class WoofCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message | void> {

        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setImage((await KaikiUtil.handleToJSON(await (await fetch("https://dog.ceo/api/breeds/image/random")).json())).message)
                    .withOkColor(message),
            ],
        });
    }
}
