import { ApplyOptions } from "@sapphire/decorators";
import { Message } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "goodbyetest",
    aliases: ["byetest"],
    usage: "",
    description: "Tests goodbye message as it would appear when triggered.",
    requiredUserPermissions: ["ManageGuild"],
    preconditions: ["GuildOnly"],
    minorCategory: "Goodbye",
})
export default class GoodbyeTestTestCommand extends KaikiCommand {
    public async messageRun(message: Message<true>): Promise<void> {
        const db = await this.client.db.getOrCreateGuild(
            BigInt(message.guildId)
        );

        const welcomeData = {
            channel: db.ByeChannel || BigInt(message.channelId),
            message: db.ByeMessage,
            timeout: db.ByeTimeout,
        };

        if (!message.member) return;

        const greetHandler = new GreetHandler(message.member);

        await greetHandler.sendWelcomeLeaveMessage(welcomeData);
    }
}
