import { Message } from "discord.js";
import { KaikiCommand } from "kaiki";
import { OkPacket } from "mysql2/promise";
import Utility from "../../lib/Util";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class SetNameCommand extends KaikiCommand {
    constructor() {
        super("sqlexec", {
            aliases: ["sqlexec"],
            description: "Executes sql queries and returns the number of affected rows. Dangerous.",
            usage: "UPDATE DiscordUsers SET amount=amount+69420",
            ownerOnly: true,
            args: [
                {
                    id: "str",
                    match: "rest",
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }
    public async exec(message: Message, { str }: { str: string}): Promise<Message> {

        const res = await this.client.connection.query<OkPacket>(str);

        return message.channel.send(await Utility.codeblock(Utility.trim(JSON.stringify(res[0], null, 4), 1960), "json"));
    }
}
