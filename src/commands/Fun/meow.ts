import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/KaikiUtil";

@ApplyOptions<KaikiCommandOptions>({
    name: "meow",
    usage: "",
    description: "Meow.",
})
export default class MeowCommand extends KaikiCommand {
    public async messageRun(message: Message): Promise<Message | void> {
        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setImage(
                        await KaikiUtil.json<string>(
                            KaikiUtil.checkResponse(
                                await fetch(
                                    "https://api.thecatapi.com/v1/images/search"
                                )
                            ),
                            ["0", "url"]
                        )
                    )
                    .setFooter({ text: "https://thecatapi.com/" })
                    .withOkColor(message),
            ],
        });
    }
}
