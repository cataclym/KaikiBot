import { Message, Permissions } from "discord.js";
import { sendWelcomeLeaveMessage } from "../../lib/GreetHandler";
import { KaikiCommand } from "kaiki";

import { getGuildDocument } from "../../struct/documentMethods";

export default class GoodbyeTestTestCommand extends KaikiCommand {
    constructor() {
        super("goodbyetest", {
            aliases: ["goodbyetest", "byetest"],
            description: "Tests goodbye message as it would appear when triggered.",
            userPermissions: Permissions.FLAGS.MANAGE_GUILD,
            channel: "guild",
            usage: "",
        });
    }

    public async exec(message: Message): Promise<void> {
        await sendWelcomeLeaveMessage((await getGuildDocument(message.guild!.id)).settings.goodbye, message.member!);
    }
}
