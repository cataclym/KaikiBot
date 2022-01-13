import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";

import { getMikuImage } from "../../lib/APIs/MikuAPI";
import { hexColorTable } from "../../lib/Color";

export default class Miku extends KaikiCommand {
    constructor() {
        super("miku", {
            aliases: ["miku"],
            description: "Spawn a Miku picture",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message> {
        return message.channel.send({ embeds: [new MessageEmbed()
            .setImage(<string> await getMikuImage())
            .setColor(hexColorTable["cyan"] as ColorResolvable)],
        });
    }
}
