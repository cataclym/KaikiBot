import { GuildMember, Message } from "discord.js";
import getWaifuPics from "../../lib/APIs/waifuPics";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class Kiss extends KaikiCommand {
    constructor() {
        super("kiss", {
            aliases: ["kiss", "smooch"],
            description: "OwO 2lood4me",
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
        return message.channel.send({ embeds: [await getWaifuPics(message, "kiss", mention)] });
    }
}
