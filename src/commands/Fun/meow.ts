import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import KaikiUtil from "Kaiki/KaikiUtil";
import KaikiCommand from "Kaiki/KaikiCommand";

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
            embeds: [new MessageEmbed()
                .setImage((await KaikiUtil.handleToJSON(await (await fetch("https://aws.random.cat/meow")).json())).file)
                .withOkColor(message)],
        });
    }
}
