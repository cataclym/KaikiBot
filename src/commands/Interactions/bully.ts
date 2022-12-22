import { GuildMember, Message } from "discord.js";
import getWaifuPics from "../../lib/APIs/waifuPics";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class Bully extends KaikiCommand {
    constructor() {
        super("bully", {
            aliases: ["bully", "bulli"],
            description: "Be a bully to someone",
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
        return message.channel.send({ embeds: [await getWaifuPics(message, "bully", mention)] });
    }
}
