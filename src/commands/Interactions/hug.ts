import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/APIs/waifuPics";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class HugCommand extends KaikiCommand {
    constructor() {
        super("hug", {
            aliases: ["hug", "hugs"],
            description: "Hug a good friend, or maybe someone special ;>",
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
        return message.channel.send({ embeds: [await sendWaifuPics(message, "hug", mention)] });
    }
}
