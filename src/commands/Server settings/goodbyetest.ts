import { Message, Permissions } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import { KaikiCommand } from "kaiki";

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

        const db = await this.client.orm.guilds.findUnique({
            where: { Id: BigInt(message.guildId!) },
            select: { ByeMessage: true, ByeChannel: true, ByeTimeout: true },
        });

        if (!db) return;

        const welcomeData = {
            channel: db.ByeChannel || BigInt(message.channelId),
            embed: db.ByeMessage,
            timeout: db.ByeTimeout || undefined,
        };

        await GreetHandler.sendWelcomeLeaveMessage(welcomeData, message.member!);
    }
}
