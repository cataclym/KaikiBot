import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

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
        return this.client.imageAPIs.PurrBot.sendImageAPIRequest(message, "feed", mention);

    }
}
