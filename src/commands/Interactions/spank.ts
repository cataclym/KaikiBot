import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class SpankCommand extends KaikiCommand {
    constructor() {
        super("spank", {
            aliases: ["spank"],
            description: "OwO Being naughty are we?",
            usage: ["", "@dreb"],
            typing: true,
            onlyNsfw: true,
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
        return this.client.imageAPIs.NekosLife.sendImageAPIRequest(message, "spank", mention);
    }
}
