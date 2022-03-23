import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import getKawaiiResponseEmbed from "../../lib/APIs/KawaiiAPI";

export default class Lick extends KaikiCommand {
    constructor() {
        super("lick", {
            aliases: ["lick"],
            description: "Lick someone... I guess...?",
            usage: ["", "@dreb"],
            typing: true,
            args: [{
                id: "mention",
                type: "member",
                default: null,
            }],
        });
    }

    public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<void | Message> {

        const embed = await getKawaiiResponseEmbed(message, "lick", mention);

        if (embed) return message.channel.send({ embeds: [embed] });
    }
}
