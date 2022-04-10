import { Message, Permissions } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class WelcomeTestCommand extends KaikiCommand {
    constructor() {
        super("welcometest", {
            aliases: ["welcometest"],
            description: "Tests welcome message as it would appear for new members.",
            userPermissions: Permissions.FLAGS.MANAGE_GUILD,
            channel: "guild",
            usage: "",
        });
    }

    public async exec(message: Message<true>): Promise<void> {
        const db = await this.client.orm.guilds.findUnique({
            where: { Id: BigInt(message.guildId) },
            select: { WelcomeChannel: true, WelcomeMessage: true, WelcomeTimeout: true },
        });

        if (!db) return;

        const welcomeData = {
            channel: db.WelcomeChannel || BigInt(message.channelId),
            embed: db.WelcomeMessage,
            timeout: db.WelcomeTimeout,
        };

        await GreetHandler.sendWelcomeLeaveMessage(welcomeData, message.member!);
    }
}
