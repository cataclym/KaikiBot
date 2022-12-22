import { GuildMember, Message } from "discord.js";
import getWaifuPics from "../../lib/APIs/waifuPics";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class Slap extends KaikiCommand {
    constructor() {
        super("slap", {
            aliases: ["slap"],
            description: "Slap someone who's being stupid",
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
        return message.channel.send({ embeds: [await getWaifuPics(message, "slap", mention)] });
    }
}
