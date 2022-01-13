import { Message, MessageEmbed } from "discord.js";
import fetch from "node-fetch";
import { KaikiCommand, KaikiUtil } from "kaiki";

export default class WoofCommand extends KaikiCommand {
    constructor() {
        super("woof", {
            aliases: ["woof"],
            description: "Woof.",
            usage: "",
        });
    }

    public async exec(message: Message): Promise<Message | void> {

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setImage((await KaikiUtil.handleToJSON(await (await fetch("https://dog.ceo/api/breeds/image/random")).json())).message)
                .withOkColor(message)],
        });
    }
}
