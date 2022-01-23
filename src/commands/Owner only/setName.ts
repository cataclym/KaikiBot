import { Message } from "discord.js";
import { KaikiCommand } from "kaiki";
import KaikiEmbeds from "../../lib/KaikiEmbeds";


export default class SetNameCommand extends KaikiCommand {
    constructor() {
        super("setname", {
            aliases: ["setname"],
            description: "Assigns the bot a new name/username.",
            usage: "Medusa",
            ownerOnly: true,
            args: [
                {
                    id: "name",
                    match: "separate",
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }
    public async exec(message: Message, { name }: { name: string[]}): Promise<Message> {

        const fullName = name.join(" ").substring(0, 32);

        await this.client.user?.setUsername(fullName);

        return message.channel.send(`Name set to \`${fullName}\``);
    }
}
