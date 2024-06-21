import { ApplyOptions } from "@sapphire/decorators";
import { EmbedBuilder, Message } from "discord.js";
import GreetHandler from "../../lib/GreetHandler";
import KaikiCommandOptions from "../../lib/Interfaces/Kaiki/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "welcometest",
    description: "Tests welcome message as it would appear for new members.",
    requiredUserPermissions: ["ManageGuild"],
    usage: "",
    preconditions: ["GuildOnly"],
    minorCategory: "Welcome",
})
export default class WelcomeTestCommand extends KaikiCommand {
    public async messageRun(message: Message<true>) {
        const db = await this.client.db.getOrCreateGuild(
            BigInt(message.guildId)
        );

        const welcomeData = {
            channel: db.WelcomeChannel || BigInt(message.channelId),
            message: db.WelcomeMessage,
            timeout: db.WelcomeTimeout,
        };

        if (!GreetHandler.assertMessageMember(message)) return;

        const greetHandler = new GreetHandler(message.member);
        const result = await greetHandler.sendWelcomeLeaveMessage(welcomeData);

        return message.channel.send({
            embeds: [
                result
                    ? new EmbedBuilder()
                        .setTitle("Message sent successfully!")
                        .withOkColor(message)
                    : new EmbedBuilder()
                        .setTitle("Message was not sent successfully!")
                        .withErrorColor(message),
            ],
        });
    }
}
