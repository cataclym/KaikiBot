import { Message } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";
import { OkPacket } from "mysql2/promise";
import { codeblock, trim } from "../../lib/Util";

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
                    otherwise: (msg: Message) => ({ embeds: [noArgGeneric(msg)] }),
                },
            ],
        });
    }
    public async exec(message: Message, { str }: { str: string}): Promise<Message> {

        const res = await this.client.connection.query<OkPacket>(str);

        return message.channel.send(await codeblock(trim(JSON.stringify(res[0], null, 4), 1960), "json"));
    }
}
