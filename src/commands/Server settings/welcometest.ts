import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import { KaikiCommandOptions } from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "welcometest",
    description: "Tests welcome message as it would appear for new members.",
    requiredUserPermissions: ["ManageGuild"],
    preconditions: ["GuildOnly"],
})
export default class WelcomeTestCommand extends KaikiCommand {
    public async messageRun(message: Message<true>): Promise<void> {

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
