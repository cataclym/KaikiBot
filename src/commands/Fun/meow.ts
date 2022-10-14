import { Message, EmbedBuilder } from "discord.js";
import fetch from "node-fetch";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiUtil from "../../lib/Kaiki/KaikiUtil";

export default class MeowCommand extends KaikiCommand {
    constructor() {
        super("meow", {
            aliases: ["meow"],
            description: "Meow.",
            usage: "",
        });
    }

    public async exec(message: Message): Promise<Message | void> {

        return message.channel.send({
            embeds: [new EmbedBuilder()
                .setImage((await KaikiUtil.handleToJSON(await (await fetch("https://aws.random.cat/meow")).json())).file)
                .withOkColor(message)],
        });
    }
}
