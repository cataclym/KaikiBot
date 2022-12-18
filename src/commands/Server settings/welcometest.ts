import { Message, PermissionsBitField } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";


export default class WelcomeTestCommand extends KaikiCommand {
    constructor() {
        super("welcometest", {
            aliases: ["welcometest"],
            description: "Tests welcome message as it would appear for new members.",
            userPermissions: PermissionsBitField.Flags.ManageGuild,
            channel: "guild",
            usage: "",
            subCategory: "Welcome",
        });
    }

    public async exec(message: Message<true>): Promise<void> {
        const db = await this.client.db.getOrCreateGuild(BigInt(message.guildId));

        const welcomeData = {
            channel: db.WelcomeChannel || BigInt(message.channelId),
            embed: db.WelcomeMessage,
            timeout: db.WelcomeTimeout,
        };

        if (!message.member) return;

        await GreetHandler.sendWelcomeLeaveMessage(welcomeData, message.member);
    }
}
