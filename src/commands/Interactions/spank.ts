import { GuildMember, Message } from "discord.js";
import sendNekosPics from "../../lib/APIs/nekos.life";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class spank extends KaikiCommand {
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
        return message.channel.send({ embeds: [await sendNekosPics(message, "spank", mention)] });
    }
}
