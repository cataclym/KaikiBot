import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

export default class Lick extends KaikiCommand {
    constructor() {
        super("lick", {
            aliases: ["lick"],
            description: "Lick someone... I guess...?",
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

    public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<void | Message> {

        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(message, "lick", mention);
    }
}
