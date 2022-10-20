import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


import getPurrBotResponseEmbed from "../../lib/APIs/PurrBot";

export default class Feed extends KaikiCommand {
    constructor() {
        super("feed", {
            aliases: ["feed"],
            description: "When you need to feed someone...?",
            usage: [""],
            typing: true,
            args: [
                {
                    id: "mention",
                    type: "member",
                    default: null,
                },
            ],
        });
    }

    public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<Message> {
        return message.channel.send({
            embeds: [await getPurrBotResponseEmbed(message, "feed", mention)],
        });
    }
}
