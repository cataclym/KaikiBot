import { GuildMember, Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class NomCommand extends KaikiCommand {
    constructor() {
        super("nom", {
            aliases: ["nom"],
            description: "Nom someone, cus you're hungry",
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
        return this.client.imageAPIs.WaifuPics.sendImageAPIRequest(message, "nom", mention);
    }
}
