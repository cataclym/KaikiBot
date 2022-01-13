import { GuildMember, Message } from "discord.js";
import sendWaifuPics from "../../lib/APIs/waifuPics";
import { KaikiCommand } from "kaiki";


export default class Nom extends KaikiCommand {
    constructor() {
        super("nom", {
            aliases: ["nom"],
            description: "Nom someone, cus you're hungry",
            usage: ["", "@dreb"],
            typing: true,
            args: [{
                id: "mention",
                type: "member",
                default: null,
            }],
        });
    }

    public async exec(message: Message, { mention }: { mention: GuildMember | null }): Promise<Message> {
        return message.channel.send({ embeds: [await sendWaifuPics(message, "nom", mention)] });
    }
}
