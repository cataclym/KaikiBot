import { Message, Permissions, PermissionsBitField } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class GoodbyeTestTestCommand extends KaikiCommand {
    constructor() {
        super("goodbyetest", {
            aliases: ["goodbyetest", "byetest"],
            description: "Tests goodbye message as it would appear when triggered.",
            userPermissions: PermissionsBitField.Flags.ManageGuild,
            channel: "guild",
            usage: "",
            subCategory: "Goodbye",
        });
    }

    public async exec(message: Message<true>): Promise<void> {

        const db = await this.client.db.getOrCreateGuild(BigInt(message.guildId));

        const welcomeData = {
            channel: db.ByeChannel || BigInt(message.channelId),
            embed: db.ByeMessage,
            timeout: db.ByeTimeout,
        };

        if (!message.member) return;

        await GreetHandler.sendWelcomeLeaveMessage(welcomeData, message.member);
    }
}
