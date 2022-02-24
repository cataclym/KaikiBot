import { Message } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

import getPurrBotResponseEmbed from "../../lib/APIs/PurrBot";

export default class Blush extends KaikiCommand {
    constructor() {
        super("blush", {
            aliases: ["blush"],
            description: "O//////O",
            usage: [""],
            typing: true,
            args: [{
                id: "mention",
                type: "member",
                default: null,
            }],
        });
    }

    public async exec(message: Message): Promise<Message> {
        return message.channel.send({ embeds: [await getPurrBotResponseEmbed(message, "blush")],
        });
    }
}
