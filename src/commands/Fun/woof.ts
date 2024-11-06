import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";

import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";

@ApplyOptions<KaikiCommandOptions>({
    name: "woof",
    usage: "",
    description: "Woof.",
})
export default class WoofCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message | void> {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setImage(
                        await KaikiUtil.json<string>(
                            KaikiUtil.checkResponse(
                                await fetch(
                                    "https://dog.ceo/api/breeds/image/random"
                                )
                            ),
                            "message"
                        )
                    )
                    .withOkColor(message),
            ],
        });
    }
}
