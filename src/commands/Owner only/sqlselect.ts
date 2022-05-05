import { Message } from "discord.js";

import { RowDataPacket } from "mysql2/promise";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Utility from "../../lib/Utility";

export default class SetNameCommand extends KaikiCommand {
    constructor() {
        super("sqlselect", {
            aliases: ["sqlselect"],
            description: "Executes sql queries and returns the number of affected rows. Dangerous.",
            usage: "SELECT * FROM DiscordUsers LIMIT 5",
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

    public async exec(message: Message, { str }: { str: string }): Promise<Message> {

        const res = await this.client.connection().query<RowDataPacket[]>(str);

        return message.channel.send(await Utility.codeblock(Utility.trim(JSON.stringify(res[0], null, 4), 1960), "json"));
    }
}
