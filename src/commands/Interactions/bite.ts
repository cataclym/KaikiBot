import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Bite extends KaikiCommand {
    constructor() {
        super("bite", {
            aliases: ["bite"],
            description: "Bite someone >:)",
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
        return this.client.imageAPIs.PurrBot.sendImageAPIRequest(message, "bite", mention);
    }
}
