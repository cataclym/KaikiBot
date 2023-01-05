import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Yeet extends KaikiCommand {
    constructor() {
        super("yeet", {
            aliases: ["yeet"],
            description: "Yeeeeeeeeeeeeeeeeeee\neeeeeeeeeeeeeeeet",
            usage: ["", "@dreb"],
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
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(message, "yeet", mention);
    }
}
